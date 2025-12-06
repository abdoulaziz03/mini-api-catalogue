def addition(a, b):
    """Returns the sum of two numbers."""
    return a + b

def maximum(*args):
    """Returns the maximum value from the given arguments."""
    if not args:
        return None
    return max(args)

def format_nom(name):
    """Formats a name by capitalizing the first letter of each word."""
    return name.title()

if __name__ == '__main__':
    print("Addition of 2 and 3:", addition(2, 3))
    print("Maximum of 1, 3, 2:", maximum(1, 3, 2))
    print("Formatted name 'john doe':", format_nom("john doe"))
