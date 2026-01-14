class Node:
   def __init__(self,data):
      self.data=data
      self.left=None
      self.right=None


class BST():
    def __init__(self):
       self.root=None

    def insert(self,value):
          if self.root is None:
             self.root=Node(value)
             return
          
          current=self.root

          while True:
             if value < current.data:
                if current.left is None:
                   current.left=Node(value)
                   return
                current=current.left
             else:
                if current.right is None:
                   current.right=Node(value)
                   return
                current=current.right

    def inorder(self,node):
       if node is None:
          return
       self.inorder(node.left)
       print(node.data, end=" ")
       self.inorder(node.right)

    def postorder(self,node):
       if node is None:
          return
       self.postorder(node.left)
       self.postorder(node.right)
       print(node.data,end=" ")

    def preorder(self,node):
       if node is None:
          return
       print(node.data,end=" ")
       self.preorder(node.left)
       self.preorder(node.right)
      
    def search_with_path(self,value):
       current=self.root
       path=[]
       while current is not None:
          path.append(current.data)
          if current.data==value:
             return path,True
          elif value < current.data:
             current=current.left
          else:
             current=current.right
       return path, False


bst=BST()
bst.insert(20)
bst.insert(40)
bst.insert(10)
bst.insert(50)
bst.insert(30)

# bst.inorder(bst.root)
# print()
# bst.postorder(bst.root)
# print()
# bst.preorder(bst.root)
# print()
path, found = bst.search_with_path(30)
print("Path:", path)
print("Found:", found)

path, found = bst.search_with_path(25)
print("Path:", path)
print("Found:", found)

