class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def generate_tree(start, end):
    if start > end:
        return None
    mid = (start + end) // 2
    node = TreeNode(mid)
    node.left = generate_tree(start, mid - 1)
    node.right = generate_tree(mid + 1, end)
    return node

root = generate_tree(1, 10)

def inorder_traversal(root):
    curr = root
    while curr is not None:
        if curr.left is None:
            print(curr.val)
            curr = curr.right
            pass
        else:
            pre = find_pre(curr)
            if pre.right is None:
                pre.right = curr
                curr = curr.left

            else:
                pre.right = None
                print(curr.val)
                curr = curr.right

def find_pre(node):
    pre = node.left
    while pre.right is not None and pre.right is not node:
        pre = pre.right
    return pre


inorder_traversal(root)

