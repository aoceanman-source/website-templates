#!/usr/bin/env python3
"""
Static Website Generator
Generates business websites from templates based on meta.json data.
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path

BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUT_DIR = BASE_DIR / "output"

def load_meta(template_type):
    """Load meta.json for the specified template type."""
    meta_path = TEMPLATES_DIR / template_type / "meta.json"
    if not meta_path.exists():
        raise FileNotFoundError(f"Template not found: {meta_path}")
    
    with open(meta_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def render_template(template_path, meta):
    """Replace {{variable}} placeholders with meta values.
    
    IMPORTANT: Process block helpers ({{#each}}) BEFORE simple variable
    substitutions to avoid replacing loop variables with top-level values.
    """
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # =====================================================
    # PHASE 1: Handle all block helpers FIRST
    # =====================================================
    
    # Handle hours array
    if '{{#hours}}' in content:
        hours_block_match = re.search(r'{{#hours}}(.*?){{/hours}}', content, re.DOTALL)
        if hours_block_match:
            hours_block = hours_block_match.group(1)
            hours_html = ''
            for h in meta.get('hours', []):
                item = hours_block
                item = item.replace('{{day}}', h.get('day', ''))
                item = item.replace('{{time}}', h.get('time', ''))
                hours_html += item
            content = re.sub(r'{{#hours}}.*?{{/hours}}', hours_html, content, flags=re.DOTALL)
    
    # Handle services array (beauty/general templates)
    if '{{#services}}' in content:
        services_block_match = re.search(r'{{#services}}(.*?){{/services}}', content, re.DOTALL)
        if services_block_match:
            services_block = services_block_match.group(1)
            services_html = ''
            for svc in meta.get('services', []):
                item = services_block
                item = item.replace('{{name}}', svc.get('name', ''))
                item = item.replace('{{price}}', str(svc.get('price', '')))
                item = item.replace('{{description}}', svc.get('description', ''))
                services_html += item
            content = re.sub(r'{{#services}}.*?{{/services}}', services_html, content, flags=re.DOTALL)
    
    # Handle departments array (clinic template)
    if '{{#departments}}' in content:
        dept_block_match = re.search(r'{{#departments}}(.*?){{/departments}}', content, re.DOTALL)
        if dept_block_match:
            dept_block = dept_block_match.group(1)
            dept_html = ''
            for dept in meta.get('departments', []):
                item = dept_block.replace('{{.}}', dept)
                dept_html += item
            content = re.sub(r'{{#departments}}.*?{{/departments}}', dept_html, content, flags=re.DOTALL)
    
    # Handle doctors array (clinic template)
    if '{{#doctors}}' in content:
        doctors_block_match = re.search(r'{{#doctors}}(.*?){{/doctors}}', content, re.DOTALL)
        if doctors_block_match:
            doctors_block = doctors_block_match.group(1)
            doctors_html = ''
            for doc in meta.get('doctors', []):
                item = doctors_block
                item = item.replace('{{name}}', doc.get('name', ''))
                item = item.replace('{{title}}', doc.get('title', ''))
                item = item.replace('{{education}}', doc.get('education', ''))
                item = item.replace('{{experience}}', doc.get('experience', ''))
                doctors_html += item
            content = re.sub(r'{{#doctors}}.*?{{/doctors}}', doctors_html, content, flags=re.DOTALL)
    
    # Handle team array (general template)
    if '{{#team}}' in content:
        team_block_match = re.search(r'{{#team}}(.*?){{/team}}', content, re.DOTALL)
        if team_block_match:
            team_block = team_block_match.group(1)
            team_html = ''
            for member in meta.get('team', []):
                item = team_block
                item = item.replace('{{name}}', member.get('name', ''))
                item = item.replace('{{title}}', member.get('title', ''))
                item = item.replace('{{bio}}', member.get('bio', ''))
                team_html += item
            content = re.sub(r'{{#team}}.*?{{/team}}', team_html, content, flags=re.DOTALL)
    
    # Handle symptoms array (clinic template) - nested items
    if '{{#symptoms}}' in content:
        symptoms_block_match = re.search(r'{{#symptoms}}(.*?){{/symptoms}}', content, re.DOTALL)
        if symptoms_block_match:
            symptoms_block = symptoms_block_match.group(1)
            symptoms_html = ''
            for symptom in meta.get('symptoms', []):
                item = symptoms_block
                item = item.replace('{{category}}', symptom.get('category', ''))
                # Handle nested items array
                if '{{#items}}' in item:
                    items_block_match = re.search(r'{{#items}}(.*?){{/items}}', item, re.DOTALL)
                    if items_block_match:
                        items_block = items_block_match.group(1)
                        items_html = ''
                        for it in symptom.get('items', []):
                            i = items_block.replace('{{.}}', it)
                            items_html += i
                        item = re.sub(r'{{#items}}.*?{{/items}}', items_html, item, flags=re.DOTALL)
                symptoms_html += item
            content = re.sub(r'{{#symptoms}}.*?{{/symptoms}}', symptoms_html, content, flags=re.DOTALL)
    
    # Handle menu_items array (restaurant template)
    if '{{#menu_items}}' in content:
        menu_block_match = re.search(r'{{#menu_items}}(.*?){{/menu_items}}', content, re.DOTALL)
        if menu_block_match:
            menu_block = menu_block_match.group(1)
            menu_html = ''
            for item in meta.get('menu_items', []):
                item_html = menu_block
                item_html = item_html.replace('{{id}}', item.get('id', ''))
                item_html = item_html.replace('{{name}}', item.get('name', ''))
                item_html = item_html.replace('{{category}}', item.get('category', ''))
                item_html = item_html.replace('{{description}}', item.get('description', ''))
                item_html = item_html.replace('{{price}}', str(item.get('price', '')))
                item_html = item_html.replace('{{image}}', item.get('image', ''))
                
                # Handle allergens block
                if 'allergens' in item and item['allergens']:
                    allergens_block_match = re.search(r'{{#allergens}}(.*?){{/allergens}}', item_html, re.DOTALL)
                    if allergens_block_match:
                        allergen_block = allergens_block_match.group(1)
                        allergens_html = ''
                        allergen_labels = {
                            'nuts': '🥜 堅果',
                            'seafood': '🦐 海鮮',
                            'gluten': '🌾 麩質',
                            'dairy': '🥛 乳製品',
                            'egg': '🥚 蛋',
                            'soy': '🫘 黃豆'
                        }
                        for allergen in item['allergens']:
                            a_html = allergen_block.replace('{{.}}', allergen)
                            label = allergen_labels.get(allergen, allergen)
                            a_html = a_html.replace('{{{allergen_label .}}}', label)
                            allergens_html += a_html
                        item_html = re.sub(r'{{#allergens}}.*?{{/allergens}}', allergens_html, item_html, flags=re.DOTALL)
                else:
                    # Remove allergens block if no allergens
                    item_html = re.sub(r'{{#allergens}}.*?{{/allergens}}', '', item_html, flags=re.DOTALL)
                
                menu_html += item_html
            content = re.sub(r'{{#menu_items}}.*?{{/menu_items}}', menu_html, content, flags=re.DOTALL)
    
    # Handle conditional social links (remove if empty)
    if 'social' in meta:
        for platform in ['facebook', 'instagram']:
            if not meta['social'].get(platform):
                content = re.sub(r'{{#social\.' + platform + r'}}.*?{{/social\.' + platform + r'}}', '', content, flags=re.DOTALL)
    
    # =====================================================
    # PHASE 2: Simple variable substitutions (after blocks)
    # =====================================================
    
    # Replace top-level simple variables (name, address, phone, etc.)
    for key, value in meta.items():
        if isinstance(value, str):
            content = content.replace(f"{{{{{key}}}}}", value)
    
    # Handle nested social object
    if 'social' in meta:
        social = meta['social']
        for platform, url in social.items():
            if url:
                content = content.replace(f"{{{{social.{platform}}}}}", url)
    
    return content

def generate_site(template_type):
    """Generate website files for the specified template type."""
    meta = load_meta(template_type)
    template_dir = TEMPLATES_DIR / template_type
    output_dir = OUTPUT_DIR / template_type
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Files to copy/process
    files = ['index.html', 'style.css', 'main.js']
    
    for filename in files:
        src = template_dir / filename
        dst = output_dir / filename
        
        if not src.exists():
            print(f"⚠️  Template file not found: {src}")
            continue
        
        if filename == 'index.html':
            # Process HTML with variable substitution
            content = render_template(src, meta)
        else:
            # Copy CSS/JS directly
            with open(src, 'r', encoding='utf-8') as f:
                content = f.read()
        
        with open(dst, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Generated: {dst}")
    
    print(f"\n🎉 Website generated at: {output_dir}")
    return output_dir

def main():
    parser = argparse.ArgumentParser(description='Generate static websites from templates')
    parser.add_argument('--type', '-t', required=True, 
                        choices=['restaurant', 'beauty', 'clinic', 'general'],
                        help='Template type to generate')
    
    args = parser.parse_args()
    
    try:
        output_dir = generate_site(args.type)
        print(f"\nOpen in browser: file://{output_dir / 'index.html'}")
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
