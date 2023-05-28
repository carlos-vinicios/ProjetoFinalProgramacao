import pandas as pd
import os

class DataController:

    def __init__(self):
        self.path = "./databases/"
    
    def check_data_path(self):
        if not os.path.isdir(self.path):
            os.mkdir(self.path)

    def save_database(self, system_path: str):
        #copy a file from system_path to the self.path
        self.check_data_path()
        os.system(f"cp {system_path} {self.path}")
    
    def get_database(self, filename: str, extension: str):
        self.check_data_path()
        database = pd.read_csv(os.path.join(self.path, filename + extension))
        database["timestamp"] = pd.to_datetime(database["timestamp"])
        return database
    
    def get_databases(self):
        self.check_data_path()
        return os.listdir(self.path)
    
    def delete_data_file(self, filename: str, extension: str):
        os.remove(os.path.join(self.path, filename + extension))
    