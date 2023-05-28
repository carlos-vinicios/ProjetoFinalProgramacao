from PySide2.QtWidgets import (
    QWidget,
    QPushButton,
    QLabel,
    QProgressBar,
    QGridLayout,
    QVBoxLayout,
    QFrame,
)

from PySide2.QtCore import (
    Qt,
    QSize
)

from PySide2.QtGui import (
    QCursor,
    QIcon
)

from src.interface import (
    DatabaseWindow
)

class DatabaseItem(QWidget):

    def __init__(self, delete_event, load_event, parent=None, database_name=None, database_id=None):
        super(DatabaseItem, self).__init__(parent)
        
        self.delete_event = delete_event
        self.load_event = load_event

        self.database_name = database_name
        self.database_id = database_id

        self.create_widgets()
        self.set_layout()
        self.add_widgets()
    
    def create_widgets(self):
        name = self.database_name.split('/')[-1]
        self.database_name_label = QLabel(name)
        self.database_name_label.setObjectName("databaseLabel")
        
        self.statistic_btn = QPushButton()
        self.statistic_btn.setIcon(QIcon("./resources/statistic.png"))
        self.statistic_btn.setIconSize(QSize(20,20))
        self.statistic_btn.setCursor(QCursor(Qt.PointingHandCursor))
        self.statistic_btn.setFixedWidth(40)
        self.statistic_btn.setFixedHeight(40)        
        self.statistic_btn.setObjectName("statisticButton")
        
        self.trash_btn = QPushButton()
        self.trash_btn.setIcon(QIcon("./resources/trash.png"))
        self.trash_btn.setIconSize(QSize(20,20))
        self.trash_btn.setCursor(QCursor(Qt.PointingHandCursor))
        self.trash_btn.setFixedWidth(40)
        self.trash_btn.setFixedHeight(40)        
        self.trash_btn.setObjectName("trashButton")
        
        self.trash_btn.clicked.connect(self.delete_element)
        self.statistic_btn.clicked.connect(self.open_database)
    
    def mousePressEvent(self, event):
       self.open_database()

    def set_layout(self):
        container = QFrame()
        container.setObjectName("databaseContainer")

        self.database_layput = QGridLayout()
        container.setLayout(self.database_layput)
        
        main_layout = QVBoxLayout()
        main_layout.addWidget(container)
        main_layout.setMargin(0)
        main_layout.setContentsMargins(0, 0, 0, 0)
        
        self.setLayout(main_layout)

    def add_widgets(self):
        self.database_layput.addWidget(self.database_name_label, 0, 0)
        self.database_layput.addWidget(self.statistic_btn, 0, 3)
        self.database_layput.addWidget(self.trash_btn, 0, 4)
    
    def delete_element(self):
        self.delete_event(self.database_name.split('/')[-1])
        self.setParent(None)
    
    def open_database(self):
        filename = self.database_name.split('/')[-1]
        extension = '.'+filename.split('.')[-1]
        filename = filename.replace(f'{extension}', '')
        data = self.load_event(filename, extension)
        
        self.database_window = DatabaseWindow(data)
        self.database_window.setWindowModality(Qt.ApplicationModal)
        self.database_window.show()
