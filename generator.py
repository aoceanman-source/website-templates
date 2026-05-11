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
    """Replace {{variable}} placeholders with meta values."""
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace simple variables
    for key, value in meta.items():
        if isinstance(value, str):
            content = content.replace(f"{{{{{key}}}}}", value)
    
    # Handle nested social object
    if 'social' in meta:
        social = meta['social']
        for platform, url in social.items():
            if url:
                content = content.replace(f"{{{{social.{platform}}}}}", url)
    
    # Handle hours array
    if 'hours' in meta:
        hours_block = content.split('{{#hours}}')[1].split('{{/hours}}')[0]
        hours_html = ''
        for h in meta['hours']:
            item = hours_block
            item = item.replace('{{day}}', h.get('day', ''))
            item = item.replace('{{time}}', h.get('time', ''))
            hours_html += item
        content = re.sub(r'{{#hours}}.*?{{/hours}}', hours_html, content, flags=re.DOTALL)
    
    # Handle menu_items array
    if 'menu_items' in meta:
        menu_block_match = re.search(r'{{#menu_items}}(.*?){{/menu_items}}', content, re.DOTALL)
        if menu_block_match:
            menu_block = menu_block_match.group(1)
            menu_html = ''
            for item in meta['menu_items']:
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
    
    # Handle conditional social links
    if 'social' in meta:
        for platform in ['facebook', 'instagram']:
            if not meta['social'].get(platform):
                content = re.sub(r'{{#social\.' + platform + r'}}.*?{{/social\.' + platform + r'}}', '', content, flags=re.DOTALL)
    
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
