# from typing import Union

from fastapi import FastAPI

# create an instance of FastAPI
app = FastAPI(title="My FastAPI APP")

# endpoint
@app.get("/") # decorator
def home(): 
    return {"message": "Hello world"}

# endpoint
# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}