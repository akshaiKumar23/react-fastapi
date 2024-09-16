class MyClass():
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"My name is {self.name} and I am {self.age} years old."


p = MyClass("ak", 23)
print(p)
