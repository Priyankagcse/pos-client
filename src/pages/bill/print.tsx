import jsPDF from 'jspdf';

let parentClass = (width: any) => `width: ${width}px; font-size: 12px;`;
let lineHeight16 = `line-height: 16px;`;
let fontStyleBold = `font-style: bold;`;
let fontBoldGray = `${fontStyleBold}; color: gray;`;
let paddingy16 = `padding-top: 16px; padding-bottom: 16px`;
let tableRow = (columnWidth: any) => `width: ${columnWidth}px; padding-top: 5px !important; padding-bottom: 5px !important; border-bottom: 1px solid rgba(224, 224, 224, 1); align-items: center !important; font-weight: unset !important; font-size: 10px !important;`

export function BillPrint(gridData: any) {
    let doc = new jsPDF('p', 'pt', 'a4');
    let tolWidth = doc.internal.pageSize.getWidth();
    let width = (tolWidth - 40);

    let columnObj = [
        {
            field: 'productName',
            displayName: 'Product',
            style: 'padding-left: 10px !important;'
        },
        {
            field: 'qty',
            displayName: 'Qty'
        },
        {
            field: 'gst',
            displayName: 'Gst'
        },
        {
            field: 'discountAmt',
            displayName: 'Discount'
        },
        {
            field: 'salePrice',
            displayName: 'Sale Price'
        },
        {
            field: 'amount',
            displayName: 'Amount'
        }
    ];

    let columnWidth = +width / columnObj.length;

    // let data = [
    //     {Product: 'Item0001', Qty: '10', Uom: 'Kg', Gst: '5%', Discount: '5%', 'Sale Price': '1000', Amount: '10000'},
    //     {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
    //     {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
    //     {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
    //     {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
    //     {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'}
    // ];

    let htmlTest = `<div style="${parentClass(width)}">
        <div style="${lineHeight16}">
            <div style="${fontStyleBold}">priya</div>
            <div style="${fontBoldGray}">9879879874</div>
            <div style="${fontBoldGray}">Chennai</div>
            <div style="${fontBoldGray}">12-feb-2022</div>
        </div>
        <div style="${paddingy16}">
            <table style="border-left: 1px solid rgba(224, 224, 224, 1); border-right: 1px solid rgba(224, 224, 224, 1); border-top: 1px solid rgba(224, 224, 224, 1);">
                <tr>
                    ${columnObj.map((column: any) => {             
                        if (column.style) {
                            return `<th style="${tableRow(columnWidth) + column.style}">${column.displayName}</th>`;
                        } else {
                            return `<th style="${tableRow(columnWidth)}">${column.displayName}</th>`;
                        }
                    }).join('')}
                </tr>
                ${gridData.map((line: any) => {                    
                    return `<tr>
                        <td style="${tableRow(columnWidth)} padding-left: 10px !important;">${line.productName}</td>
                        <td style="${tableRow(columnWidth)}">${line.qty} ${line.uom}</td>
                        <td style="${tableRow(columnWidth)}">${line.gst}</td>
                        <td style="${tableRow(columnWidth)}">${line.discountAmt || ''}</td>
                        <td style="${tableRow(columnWidth)}">${line['salePrice']}</td>
                        <td style="${tableRow(columnWidth)}">${line.amount}</td>
                    </tr>`;
                }).join('')}
            </table>
        </div>
    </div>`;

    let option = {
        async callback(doc: jsPDF) {
            // await doc.save('document');
            // doc.autoPrint();
            window.open(URL.createObjectURL(doc.output('blob') as any), 'print', 'height=600,width=1024,tabbar=no');
        }, x: 20, y: 20
    };
    doc.html(htmlTest, option);
}