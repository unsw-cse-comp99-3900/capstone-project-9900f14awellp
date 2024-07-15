import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime

def parse_date(date_string):
    # Convert /Date(1719705600000+0000)/ to datetime
    timestamp = int(date_string[6:19]) // 1000
    return datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d')

def converter_xml(input_file):
    # 解析原始XML文件
    tree = ET.parse(input_file)
    root = tree.getroot()

    # 创建UBL发票XML结构
    invoice = ET.Element('Invoice', {
        'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
        'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
    })

    # 添加发票基本信息
    ET.SubElement(invoice, 'cbc:ID').text = root.findtext('invoice_number')
    ET.SubElement(invoice, 'cbc:IssueDate').text = parse_date(root.find('form_data/invoiceDate').text)
    ET.SubElement(invoice, 'cbc:InvoiceTypeCode').text = '380'  # 380表示普通发票
    ET.SubElement(invoice, 'cbc:DocumentCurrencyCode').text = 'AUD'

    # 添加供应商信息
    supplier_party = ET.SubElement(invoice, 'cac:AccountingSupplierParty')
    supplier = ET.SubElement(supplier_party, 'cac:Party')
    ET.SubElement(supplier, 'cbc:EndpointID').text = root.findtext('form_data/abn')
    supplier_name = ET.SubElement(supplier, 'cac:PartyName')
    ET.SubElement(supplier_name, 'cbc:Name').text = root.findtext('supplier_name')
    supplier_address = ET.SubElement(supplier, 'cac:PostalAddress')
    ET.SubElement(supplier_address, 'cbc:StreetName').text = '123 BUSINESSST'
    ET.SubElement(supplier_address, 'cbc:CityName').text = 'SYDNEY'
    ET.SubElement(supplier_address, 'cbc:PostalZone').text = '2000'
    ET.SubElement(supplier_address, 'cbc:CountrySubentity').text = 'NSW'
    supplier_country = ET.SubElement(supplier_address, 'cac:Country')
    ET.SubElement(supplier_country, 'cbc:IdentificationCode').text = 'AU'
    supplier_tax = ET.SubElement(supplier, 'cac:PartyTaxScheme')
    ET.SubElement(supplier_tax, 'cbc:CompanyID').text = '12345678901'
    tax_scheme = ET.SubElement(supplier_tax, 'cac:TaxScheme')
    ET.SubElement(tax_scheme, 'cbc:ID').text = 'GST'

    # 添加客户信息
    customer_party = ET.SubElement(invoice, 'cac:AccountingCustomerParty')
    customer = ET.SubElement(customer_party, 'cac:Party')
    customer_name = ET.SubElement(customer, 'cac:PartyName')
    ET.SubElement(customer_name, 'cbc:Name').text = 'JOHN DOE'
    customer_address = ET.SubElement(customer, 'cac:PostalAddress')
    ET.SubElement(customer_address, 'cbc:StreetName').text = '456 CLIENTRD'
    ET.SubElement(customer_address, 'cbc:CityName').text = 'MELBOURNE'
    ET.SubElement(customer_address, 'cbc:PostalZone').text = '3000'
    ET.SubElement(customer_address, 'cbc:CountrySubentity').text = 'VIC'
    customer_country = ET.SubElement(customer_address, 'cac:Country')
    ET.SubElement(customer_country, 'cbc:IdentificationCode').text = 'AU'

    # 添加税金信息
    tax_total = ET.SubElement(invoice, 'cac:TaxTotal')
    ET.SubElement(tax_total, 'cbc:TaxAmount', currencyID='AUD').text = root.findtext('gst_total')

    # 添加总金额
    legal_monetary_total = ET.SubElement(invoice, 'cac:LegalMonetaryTotal')
    ET.SubElement(legal_monetary_total, 'cbc:PayableAmount', currencyID='AUD').text = root.findtext('total')

    # 添加发票行项目
    invoice_line = ET.SubElement(invoice, 'cac:InvoiceLine')
    ET.SubElement(invoice_line, 'cbc:ID').text = '1'
    ET.SubElement(invoice_line, 'cbc:InvoicedQuantity', unitCode='EA').text = '1'
    ET.SubElement(invoice_line, 'cbc:LineExtensionAmount', currencyID='AUD').text = root.findtext('total')
    item = ET.SubElement(invoice_line, 'cac:Item')
    ET.SubElement(item, 'cbc:Description').text = 'Example item description'
    price = ET.SubElement(invoice_line, 'cac:Price')
    ET.SubElement(price, 'cbc:PriceAmount', currencyID='AUD').text = root.findtext('total')

    # 格式化输出XML
    xml_str = ET.tostring(invoice, encoding='utf-8')
    parsed_str = minidom.parseString(xml_str).toprettyxml(indent="  ")

    # 将格式化后的XML写入文件
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(parsed_str)
