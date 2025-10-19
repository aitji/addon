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
        addon_folder = os.path.join(folder, 'addon')
        if os.path.exists(addon_folder) and os.listdir(addon_folder):
            temp_zip = os.path.join(folder, '__temp__', 'Download.mcpack')
            os.makedirs(os.path.dirname(temp_zip), exist_ok=True)
            zip_folder(addon_folder, temp_zip)

            target_file = os.path.join(folder, 'Download.mcpack')
            if not os.path.exists(target_file) or not filecmp.cmp(temp_zip, target_file, shallow=False):
                if os.path.exists(target_file):
                    os.remove(target_file)
                shutil.move(temp_zip, folder)
            shutil.rmtree(os.path.dirname(temp_zip))

def main():
    root = os.getcwd()
    process_folders(root)

if __name__ == "__main__":
    import filecmp
    main()