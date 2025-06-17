#!/usr/bin/env python3
"""
Mac Wayne Site Testing Assistant
This script helps facilitate manual testing according to the FINAL-TESTING-CHECKLIST.md
It guides testers through each section and allows them to record results
"""

import os
import sys
import re
import datetime
import json

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def read_checklist(file_path):
    """Read the testing checklist from the markdown file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return content

def extract_tables(content):
    """Extract all tables from the markdown content"""
    tables = []
    table_pattern = r'\n\| Test \| Description \| .+?\n\|---+\|---+\|.+?\n((?:\|.*\n)+)'
    matches = re.finditer(table_pattern, content, re.DOTALL)
    
    for match in matches:
        table_content = match.group(1)
        rows = []
        for line in table_content.strip().split('\n'):
            if line.startswith('|'):
                cells = [cell.strip() for cell in line.split('|')[1:-1]]
                if len(cells) >= 2 and cells[0].startswith('☐'):
                    test_name = cells[0][1:].strip()
                    description = cells[1]
                    rows.append({'test': test_name, 'description': description, 'status': 'Not Tested'})
        if rows:
            tables.append(rows)
    
    return tables

def extract_sections(content):
    """Extract section titles from the markdown content"""
    sections = []
    section_pattern = r'## (\d+\.\s.+?)\n'
    matches = re.finditer(section_pattern, content)
    
    for match in matches:
        sections.append(match.group(1))
    
    return sections

def run_testing_assistant(checklist_path):
    """Run the interactive testing assistant"""
    try:
        content = read_checklist(checklist_path)
        sections = extract_sections(content)
        tables = extract_tables(content)
        
        results = {}
        
        for i, section in enumerate(sections):
            if i < len(tables):
                results[section] = tables[i]
        
        while True:
            clear_screen()
            print("=== Mac Wayne Site Testing Assistant ===")
            print(f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("\nSelect a testing section to work on:")
            
            for i, section in enumerate(sections):
                tests_total = len(tables[i]) if i < len(tables) else 0
                tests_completed = sum(1 for test in tables[i] if test['status'] != 'Not Tested') if i < len(tables) else 0
                print(f"{i+1}. {section} ({tests_completed}/{tests_total} completed)")
            
            print("\n0. Save and exit")
            
            choice = input("\nEnter your choice (0-{}): ".format(len(sections)))
            
            if choice == '0':
                # Save results
                save_results(results, checklist_path)
                print("\nTest results saved. Goodbye!")
                break
            
            try:
                section_idx = int(choice) - 1
                if 0 <= section_idx < len(sections):
                    run_section_tests(sections[section_idx], tables[section_idx])
                else:
                    print("Invalid choice. Press Enter to continue...")
                    input()
            except ValueError:
                print("Invalid input. Press Enter to continue...")
                input()
    
    except Exception as e:
        print(f"Error: {e}")
        input("Press Enter to exit...")

def run_section_tests(section_title, tests):
    """Run tests for a specific section"""
    while True:
        clear_screen()
        print(f"=== Testing Section: {section_title} ===")
        print("\nTests in this section:")
        
        for i, test in enumerate(tests):
            status_symbol = "✅" if test['status'] == 'Pass' else "❌" if test['status'] == 'Fail' else "⚠️" if test['status'] == 'Warning' else "☐"
            print(f"{i+1}. {status_symbol} {test['test']}")
        
        print("\n0. Back to main menu")
        
        choice = input("\nSelect a test to execute (0-{}): ".format(len(tests)))
        
        if choice == '0':
            break
        
        try:
            test_idx = int(choice) - 1
            if 0 <= test_idx < len(tests):
                execute_test(tests[test_idx])
            else:
                print("Invalid choice. Press Enter to continue...")
                input()
        except ValueError:
            print("Invalid input. Press Enter to continue...")
            input()

def execute_test(test):
    """Execute a specific test and record results"""
    clear_screen()
    print(f"=== Executing Test: {test['test']} ===")
    print(f"\nDescription: {test['description']}")
    print("\nCurrent Status: {}".format(test['status']))
    
    print("\nInstructions:")
    print("1. Manually test the feature according to the description")
    print("2. Record the test result below")
    
    print("\nTest Result Options:")
    print("1. Pass - Feature works as expected")
    print("2. Fail - Feature doesn't work")
    print("3. Warning - Feature works partially or has minor issues")
    print("4. Not Tested - Skip this test for now")
    
    choice = input("\nEnter test result (1-4): ")
    
    if choice == '1':
        test['status'] = 'Pass'
    elif choice == '2':
        test['status'] = 'Fail'
        test['notes'] = input("Enter issue details: ")
    elif choice == '3':
        test['status'] = 'Warning'
        test['notes'] = input("Enter warning details: ")
    elif choice == '4':
        test['status'] = 'Not Tested'
    else:
        print("Invalid choice. Test status not updated.")
    
    print("\nTest result recorded. Press Enter to continue...")
    input()

def save_results(results, checklist_path):
    """Save test results to a JSON file"""
    output_file = os.path.splitext(checklist_path)[0] + "-results.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"Results saved to {output_file}")
    
    # Also create a markdown report
    create_markdown_report(results, checklist_path)

def create_markdown_report(results, checklist_path):
    """Create a markdown report from test results"""
    output_file = os.path.splitext(checklist_path)[0] + "-results.md"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Mac Wayne Site Testing Results\n\n")
        f.write(f"Testing Date: {datetime.datetime.now().strftime('%Y-%m-%d')}\n\n")
        
        for section, tests in results.items():
            f.write(f"## {section}\n\n")
            
            pass_count = sum(1 for test in tests if test['status'] == 'Pass')
            fail_count = sum(1 for test in tests if test['status'] == 'Fail')
            warning_count = sum(1 for test in tests if test['status'] == 'Warning')
            not_tested_count = sum(1 for test in tests if test['status'] == 'Not Tested')
            
            f.write(f"**Summary**: ")
            f.write(f"✅ {pass_count} Passed, ")
            f.write(f"❌ {fail_count} Failed, ")
            f.write(f"⚠️ {warning_count} Warnings, ")
            f.write(f"{not_tested_count} Not Tested\n\n")
            
            f.write("| Test | Description | Status | Notes |\n")
            f.write("|------|-------------|--------|-------|\n")
            
            for test in tests:
                status_symbol = "✅" if test['status'] == 'Pass' else "❌" if test['status'] == 'Fail' else "⚠️" if test['status'] == 'Warning' else "☐"
                notes = test.get('notes', '')
                f.write(f"| {test['test']} | {test['description']} | {status_symbol} {test['status']} | {notes} |\n")
            
            f.write("\n")
    
    print(f"Markdown report saved to {output_file}")

if __name__ == "__main__":
    checklist_path = "FINAL-TESTING-CHECKLIST.md"
    
    if not os.path.exists(checklist_path):
        print(f"Error: Could not find {checklist_path}")
        sys.exit(1)
    
    run_testing_assistant(checklist_path)
