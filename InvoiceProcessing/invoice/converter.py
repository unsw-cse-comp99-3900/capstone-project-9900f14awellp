import xml.etree.ElementTree as ET
from xml.dom import minidom

def get_text(element, default=""):
    return element.text if element is not None and element.text else default

def prettify(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

def convert_form_data_to_ubl(form_data, invoice_form, table):
    # Create UBL root element
    invoice = ET.Element('Invoice', {
        'xmlns': "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        'xmlns:cac': "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        'xmlns:cbc': "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    })

    # Invoice ID
    cbc_id = ET.SubElement(invoice, 'cbc:ID')
    cbc_id.text = get_text(form_data.find('invoiceNumber'))

    # Issue Date
    cbc_issue_date = ET.SubElement(invoice, 'cbc:IssueDate')
    cbc_issue_date.text = get_text(form_data.find('invoiceDate'))

    # AccountingSupplierParty
    cac_supplier_party = ET.SubElement(invoice, 'cac:AccountingSupplierParty')
    cac_supplier_party_party = ET.SubElement(cac_supplier_party, 'cac:Party')
    cbc_party_name = ET.SubElement(cac_supplier_party_party, 'cbc:PartyName')
    cbc_name = ET.SubElement(cbc_party_name, 'cbc:Name')
    cbc_name.text = get_text(form_data.find('supplier'))
    cac_postal_address = ET.SubElement(cac_supplier_party_party, 'cac:PostalAddress')
    supplier_address = get_text(form_data.find('supplier_address')).split('\n')
    cbc_street_name = ET.SubElement(cac_postal_address, 'cbc:StreetName')
    cbc_street_name.text = supplier_address[1] if len(supplier_address) > 1 else ""
    cbc_city_name = ET.SubElement(cac_postal_address, 'cbc:CityName')
    cbc_city_name.text = supplier_address[0] if len(supplier_address) > 0 else ""
    cbc_postal_zone = ET.SubElement(cac_postal_address, 'cbc:PostalZone')
    cbc_postal_zone.text = ""  # 可以根据需要解析更多信息
    cbc_country = ET.SubElement(cac_postal_address, 'cbc:Country')
    cbc_country_code = ET.SubElement(cbc_country, 'cbc:IdentificationCode')
    cbc_country_code.text = "AU"  # 固定值

    # AccountingCustomerParty
    cac_customer_party = ET.SubElement(invoice, 'cac:AccountingCustomerParty')
    cac_customer_party_party = ET.SubElement(cac_customer_party, 'cac:Party')
    cbc_party_name = ET.SubElement(cac_customer_party_party, 'cbc:PartyName')
    cbc_name = ET.SubElement(cbc_party_name, 'cbc:Name')
    cbc_name.text = get_text(form_data.find('company_invoiced')).strip()
    cac_postal_address = ET.SubElement(cac_customer_party_party, 'cac:PostalAddress')
    delivery_to_address = get_text(form_data.find('delivery_to_address')).split('\n')
    cbc_street_name = ET.SubElement(cac_postal_address, 'cbc:StreetName')
    cbc_street_name.text = delivery_to_address[1] if len(delivery_to_address) > 1 else ""
    cbc_city_name = ET.SubElement(cac_postal_address, 'cbc:CityName')
    cbc_city_name.text = delivery_to_address[0] if len(delivery_to_address) > 0 else ""
    cbc_postal_zone = ET.SubElement(cac_postal_address, 'cbc:PostalZone')
    cbc_postal_zone.text = ""  # 可以根据需要解析更多信息
    cbc_country = ET.SubElement(cac_postal_address, 'cbc:Country')
    cbc_country_code = ET.SubElement(cbc_country, 'cbc:IdentificationCode')
    cbc_country_code.text = "AU"  # 固定值

    # InvoiceLine
    for idx, item in enumerate(table.findall('item')):
        cac_invoice_line = ET.SubElement(invoice, 'cac:InvoiceLine')
        cbc_line_id = ET.SubElement(cac_invoice_line, 'cbc:ID')
        cbc_line_id.text = str(idx + 1)
        cbc_invoiced_quantity = ET.SubElement(cac_invoice_line, 'cbc:InvoicedQuantity')
        cbc_invoiced_quantity.text = get_text(item.find('quantity'))
        cbc_line_extension_amount = ET.SubElement(cac_invoice_line, 'cbc:LineExtensionAmount', {
            'currencyID': "AUD"
        })
        cbc_line_extension_amount.text = get_text(item.find('total'))
        cac_item = ET.SubElement(cac_invoice_line, 'cac:Item')
        cbc_description = ET.SubElement(cac_item, 'cbc:Description')
        cbc_description.text = get_text(item.find('description'))
        cac_price = ET.SubElement(cac_invoice_line, 'cac:Price')
        cbc_price_amount = ET.SubElement(cac_price, 'cbc:PriceAmount', {
            'currencyID': "AUD"
        })
        cbc_price_amount.text = get_text(item.find('unit_price'))

    # LegalMonetaryTotal
    cac_legal_monetary_total = ET.SubElement(invoice, 'cac:LegalMonetaryTotal')
    cbc_line_extension_amount = ET.SubElement(cac_legal_monetary_total, 'cbc:LineExtensionAmount', {
        'currencyID': "AUD"
    })
    cbc_line_extension_amount.text = get_text(form_data.find('total'))
    cbc_tax_exclusive_amount = ET.SubElement(cac_legal_monetary_total, 'cbc:TaxExclusiveAmount', {
        'currencyID': "AUD"
    })
    cbc_tax_exclusive_amount.text = get_text(invoice_form.find('gstTotal'))
    cbc_tax_inclusive_amount = ET.SubElement(cac_legal_monetary_total, 'cbc:TaxInclusiveAmount', {
        'currencyID': "AUD"
    })
    cbc_tax_inclusive_amount.text = get_text(invoice_form.find('invoiceTotal'))
    cbc_payable_amount = ET.SubElement(cac_legal_monetary_total, 'cbc:PayableAmount', {
        'currencyID': "AUD"
    })
    cbc_payable_amount.text = get_text(invoice_form.find('invoiceTotal'))

    # Additional Invoice Information
    cbc_subtotal_amount = ET.SubElement(cac_legal_monetary_total, 'cbc:SubTotalAmount', {
        'currencyID': "AUD"
    })
    cbc_subtotal_amount.text = get_text(invoice_form.find('subTotal'))

    # Payment Information
    cbc_payment_date = ET.SubElement(invoice, 'cbc:PaymentMeans')
    cbc_payment_date.text = get_text(invoice_form.find('paymentDate'))

    return prettify(invoice)

def converter_xml(input_file):
    tree = ET.parse(input_file)
    root = tree.getroot()
    form_data = root.find('form_data')
    invoice_form = root.find('invoiceForm')
    table = root.find('table')
    ubl_invoice = convert_form_data_to_ubl(form_data, invoice_form, table)
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(ubl_invoice)
        
