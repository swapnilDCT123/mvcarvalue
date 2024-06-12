import os
import subprocess

def download_udemy_course(course_url, username, password, output_dir):
    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Construct the command
    command = [
        'udemy-dl',
        course_url,
        '--username', username,
        '--password', password,
        '--output', output_dir
    ]
    
    # Run the command
    result = subprocess.run(command, capture_output=True, text=True)
    
    # Print the output and error (if any)
    print(result.stdout)
    if result.stderr:
        print("Error:", result.stderr)

# Example usage
course_url = 'https://www.udemy.com/course/your-course-id'
username = 'your-udemy-email@example.com'
password = 'your-udemy-password'
output_dir = 'path/to/download/directory'

download_udemy_course(course_url, username, password, output_dir)
