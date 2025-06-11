<?php

class InputHelper
{
    // Sanitize string input
    public static function sanitizeString($input)
    {
        return htmlentities($input, ENT_QUOTES | ENT_IGNORE, "UTF-8");
    }

    // Sanitize email input
    public static function sanitizeEmail($input)
    {
        return filter_var(trim($input), FILTER_SANITIZE_EMAIL);
    }

    // Sanitize URL input
    public static function sanitizeURL($input)
    {
        return filter_var(trim($input), FILTER_SANITIZE_URL);
    }

    // Sanitize integer input
    public static function sanitizeInt($input)
    {
        return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
    }

    // Sanitize float input
    public static function sanitizeFloat($input)
    {
        return filter_var($input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }

    // Validate email
    public static function validateEmail($input)
    {
        return filter_var($input, FILTER_VALIDATE_EMAIL) !== false;
    }

    // Validate URL
    public static function validateURL($input)
    {
        return filter_var($input, FILTER_VALIDATE_URL) !== false;
    }

    // Validate integer
    public static function validateInt($input)
    {
        return filter_var($input, FILTER_VALIDATE_INT) !== false;
    }

    // Validate float
    public static function validateFloat($input)
    {
        return filter_var($input, FILTER_VALIDATE_FLOAT) !== false;
    }

    // Validate length of string
    public static function validateLength($input, $minLength = 0, $maxLength = PHP_INT_MAX)
    {
        $length = strlen(trim($input));
        return $length >= $minLength && $length <= $maxLength;
    }

    // Check if input is empty
    public static function isEmpty($input)
    {
        if (is_array($input)) {
            return empty($input);
        }
        return trim($input) === '';
    }

    // Escape special characters for HTML output
    public static function escapeHTML($input)
    {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }


    // Required Fields...
    public static function requiredFields(array $input, array $requiredFields)
    {
        foreach ($requiredFields as $field) {
            if (!isset($input[$field])) {
                return "Missing required field: $field";
            } else if (self::isEmpty($input[$field])) {
                return "Empty input for: $field";
            }
        }
        return true;
    }

}
