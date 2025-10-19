import os
import shutil
import zipfile

def zip_folder(folder_path, zip_file_name):
    with zipfile.ZipFile(zip_file_name, 'w') as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, relative_path)

def process_folders(root_folder):
    for folder, subfolders, files in os.walk(root_folder):
        print(f"[🔃] Processing: {os.path.basename(folder)}")
        addon_folder = os.path.join(folder, 'addon')
        if os.path.exists(addon_folder):
            addon_files = os.listdir(addon_folder)
            if addon_files:
                print(f"[👀] Found addon in: {os.path.basename(folder)}")
                temp_folder = os.path.join(folder, '__temp__')
                os.makedirs(temp_folder, exist_ok=True)
                zip_folder(addon_folder, os.path.join(temp_folder, 'Download.mcpack'))
                existing_addon_file = os.path.join(folder, 'Download.mcpack')
                if os.path.exists(existing_addon_file):
                    os.remove(existing_addon_file)
                    print(f"[🗑️] Deleted existing Download.mcpack in: {os.path.basename(folder)}")
                shutil.move(os.path.join(temp_folder, 'Download.mcpack'), folder)
                print(f"[📝] Replaced Download.mcpack in: {os.path.basename(folder)}")
                shutil.rmtree(temp_folder)
                print(f"[🧹] Cleaned temporary folder in: {os.path.basename(folder)}")

def main():
    root_folder_path = os.getcwd()
    print(f"[🪶] Cleaning old Download.mcpack files\nRoot={root_folder_path}\n")

    for root, dirs, files in os.walk(root_folder_path):
        for file in files:
            if file == 'Download.mcpack':
                os.remove(os.path.join(root, file))
                print(f"[🗑️] Deleted existing {file} in: {os.path.basename(root)}")

    process_folders(root_folder_path)

if __name__ == "__main__":
    print(f"## Request from: {__name__}\n| main connection pass!\n")
    try:
        main()
    except Exception as e:
        print("❌ Error:", e)
        exit(1)