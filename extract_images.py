
import os
from pypdf import PdfReader

def extract_images(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    reader = PdfReader(pdf_path)
    count = 0
    
    print(f"Processing {pdf_path} with {len(reader.pages)} pages...")

    for page_num, page in enumerate(reader.pages):
        for image_file_object in page.images:
            try:
                # Filter out small icons/logos if possible by size, but for now just save all
                # image_file_object.name usually has extension
                
                # Construct output path
                # Use page number in filename to help context
                filename = f"page{page_num+1}_{image_file_object.name}"
                filepath = os.path.join(output_dir, filename)
                
                with open(filepath, "wb") as fp:
                    fp.write(image_file_object.data)
                
                print(f"Saved {filepath}")
                count += 1
            except Exception as e:
                print(f"Error saving image on page {page_num+1}: {e}")

    print(f"Extracted {count} images to {output_dir}")

if __name__ == "__main__":
    extract_images("imstem画册.pdf", "images/extracted")
