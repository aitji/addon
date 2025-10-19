import os
import shutil
import zipfile
import filecmp


def zip_folder(folder_path, zip_file_name):
    with zipfile.ZipFile(zip_file_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, relative_path)


def process_folders(root_folder):
    updated_count = 0
    scanned_count = 0
    skipped_count = 0

    print("(🔍) scanning for addon folders...")
    print(f"(📁) root directory: {root_folder}\n")

    for folder, subfolders, files in os.walk(root_folder):
        addon_folder = None
        for folder_name in ['addon', 'Addon']:
            test_path = os.path.join(folder, folder_name)
            if os.path.exists(test_path):
                addon_folder = test_path
                break

        if addon_folder is None:
            continue

        if not os.listdir(addon_folder):
            print(f"(⚠️) empty addon folder: {addon_folder}")
            continue

        scanned_count += 1

        temp_dir = os.path.join(folder, '__temp__')
        temp_zip = os.path.join(temp_dir, 'Download.mcpack')
        os.makedirs(temp_dir, exist_ok=True)

        try:
            zip_folder(addon_folder, temp_zip)
            target_file = os.path.join(folder, 'Download.mcpack')

            needs_update = True
            if os.path.exists(target_file):
                needs_update = not filecmp.cmp(
                    temp_zip, target_file, shallow=False)

            if needs_update:
                if os.path.exists(target_file):
                    old_size = os.path.getsize(target_file)
                    new_size = os.path.getsize(temp_zip)
                    print(f"(📝) updating: {target_file}")
                    print(f"    old size: {old_size:,} bytes")
                    print(f"    new size: {new_size:,} bytes")
                    os.remove(target_file)
                else:
                    new_size = os.path.getsize(temp_zip)
                    print(f"(✨) creating: {target_file}")
                    print(f"    size: {new_size:,} bytes")

                shutil.move(temp_zip, target_file)
                updated_count += 1
            else:
                size = os.path.getsize(target_file)
                print(f"(✓) unchanged: {target_file} ({size:,} bytes)")
                skipped_count += 1

        except Exception as e:
            print(f"(✗) error processing {folder}: {str(e)}")

        finally:
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)

    return updated_count, scanned_count, skipped_count


def main():
    root = os.getcwd()
    print("=" * 60)
    print("(🤖) starting download.mcpack auto-update")
    print(f"Root: {root}")
    print("=" * 60)
    print()

    updated, scanned, skipped = process_folders(root)

    print()
    print("=" * 60)
    print("(📊) summary:")
    print(f"  • addon folders scanned: {scanned}")
    print(f"  • files updated: {updated}")
    print(f"  • files unchanged: {skipped}")
    print("=" * 60)

    if updated > 0:
        print(f"\n(✅) successfully updated {updated} file(s)!")
    else:
        print(f"\n(✓) all files are up to date!")


if __name__ == "__main__":
    main()
