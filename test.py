import unittest
from operations import addition, maximum, format_nom

class TestOperations(unittest.TestCase):

    def test_addition_positive(self):
        self.assertEqual(addition(2, 3), 5)

    def test_addition_negative(self):
        self.assertEqual(addition(-1, -1), -2)

    def test_addition_zero(self):
        self.assertEqual(addition(0, 5), 5)

    def test_maximum_single(self):
        self.assertEqual(maximum(5), 5)

    def test_maximum_multiple(self):
        self.assertEqual(maximum(1, 3, 2), 3)

    def test_maximum_empty(self):
        self.assertIsNone(maximum())

    def test_format_nom_single_word(self):
        self.assertEqual(format_nom("john"), "John")

    def test_format_nom_multiple_words(self):
        self.assertEqual(format_nom("john doe"), "John Doe")

    def test_format_nom_already_formatted(self):
        self.assertEqual(format_nom("John Doe"), "John Doe")

if __name__ == '__main__':
    unittest.main()
