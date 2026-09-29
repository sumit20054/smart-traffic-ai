import numpy as np
from sklearn.tree import DecisionTreeClassifier

# Sample training data
X = [
    [10, 20, 30, 40],
    [50, 20, 10, 5],
    [5, 60, 10, 20],
    [20, 10, 70, 15],
]

y = ["west", "north", "south", "east"]

model = DecisionTreeClassifier()
model.fit(X, y)

def predict_traffic(data):
    return model.predict([data])[0]