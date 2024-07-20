# invoice/tasks.py
from celery import shared_task
import requests
import xml.etree.ElementTree as ET
from xml.dom import minidom
import os
import json
from .converter import converter_xml
from time import sleep
def json_to_xml(json_obj, line_padding=""):
    elem = ET.Element('root')
    
    def build_element(parent, key, value):
        if isinstance(value, dict):
            subelem = ET.SubElement(parent, key)
            for subkey, subvalue in value.items():
                build_element(subelem, subkey, subvalue)
        elif isinstance(value, list):
            for subvalue in value:
                subelem = ET.SubElement(parent, key)
                build_element(subelem, 'item', subvalue)
        else:
            subelem = ET.SubElement(parent, key)
            subelem.text = str(value) if value is not None else ''

    for key, value in json_obj.items():
        build_element(elem, key, value)
    
    return elem

def prettify(elem):
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")


@shared_task
def extract_pdf_data(file_path,userid):

    file_name = os.path.basename(str(file_path))
    file_stem = os.path.splitext(file_name)[0]
    
    # 1.将json文件转化为xml，for Later validation
    if str(file_path).endswith('.json'):
            with open(str(file_path), 'r') as f:
                data = json.load(f)
                # json -> xml
                xml_elem = json_to_xml(data)
                xml_str = prettify(xml_elem)
            with open(f"staticfiles/{userid}/{file_stem}.xml", "w", encoding="utf-8") as f:
                f.write(xml_str)
            converter_xml(f"staticfiles/{userid}/{file_stem}.xml")
    elif str(file_path).endswith('.pdf'):
        url = 'https://app.ezzydoc.com/EzzyService.svc/Rest'
        api_key = {'APIKey': 'b2cfb232-7b4f-4e1e-ae12-d044a8f335cb'}
        payload = {'user': 'ZZZhao',
                'pwd': 'Zlq641737796',
                'APIKey': 'b2cfb232-7b4f-4e1e-ae12-d044a8f335cb'}
        # 保留cookie
        r = requests.get(url + '/Login', params=payload)
        
        # 1.2 上传pdf文件
        with open(str(file_path), 'rb') as img_file:
            img_name = f"{file_stem}.pdf"
            data = img_file.read()
            b = bytearray(data)
            li = []
            for i in b:
                li.append(i)
            raw_data = {"PictureName": img_name, "PictureStream": li}
            json_data = json.dumps(raw_data)
            r2 = requests.post("https://app.ezzydoc.com/EzzyService.svc/Rest/uploadInvoiceImage",
                            data=json_data,
                            cookies=r.cookies,
                            params=api_key,
                            headers={'Content-Type': 'application/json'})
            invoiceID = str(r2.json().get("invoice_id"))
        # 1.3 获得传回的json数据
        payload2 = {'invoiceid':invoiceID,
                    'APIKey': 'b2cfb232-7b4f-4e1e-ae12-d044a8f335cb'}
    
        sleep(60)
        r3 = requests.get(url + '/getFormData', cookies=r.cookies,params=payload2)
        r4 = requests.get(url + '/getInvoiceHeaderBlocks', cookies=r.cookies,params=payload2)

        if r3.status_code == 200:
            form_data = r3.json().get('form_data', {})
            invoiceForm = r4.json().get('invoiceForm', {})
            table = r4.json().get('table', {})
            combined_data = {
                "form_data": form_data,
                "invoiceForm": invoiceForm,
                "table": table,

            }

            with open(f"staticfiles/{userid}/{file_stem}.json", "w", encoding="utf-8") as f:
                json.dump(combined_data, f, ensure_ascii=False, indent=4)
                
            xml_elem = json_to_xml(combined_data)
            xml_str = prettify(xml_elem)
            with open(f"staticfiles/{userid}/{file_stem}.xml", "w", encoding="utf-8") as f:
                f.write(xml_str)
            converter_xml(f"staticfiles/{userid}/{file_stem}.xml")
            
            
            