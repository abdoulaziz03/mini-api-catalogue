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
