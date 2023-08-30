import jsPDF from 'jspdf';

export function BillPrint() {
    let doc = new jsPDF('p', 'pt', 'a4');
    let tolWidth = doc.internal.pageSize.getWidth();
    let width = (tolWidth - 40) + 'px';

    let data = [
        {Product: 'Item0001', Qty: '10', Uom: 'Kg', Gst: '5%', Discount: '5%', 'Sale Price': '1000', Amount: '10000'},
        {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
        {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
        {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
        {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'},
        {Product: 'Item0002', Qty: '20', Uom: 'Kg', Gst: '10%', Discount: '10%', 'Sale Price': '2000', Amount: '20000'}
    ];

    let htmlTest = `<div style="width: ${width}">
        <div>
            <span style="color: gray">Cust :</span>
            <span> priya</span>
        </div>
        <div>Phone No : 9879879874</div>
        <div>Address : Chennai</div>
        <div>Date : 12-feb-2022</div>
        <table>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Uom</th>
                <th>Gst</th>
                <th>Discount</th>
                <th>Sale Price</th>
                <th>Amount</th>
            </tr>
            ${data.map((line: any) => {                    
                return `<tr>
                    <td>${line.Product}</td>
                    <td>${line.Qty}</td>
                    <td>${line.Uom}</td>
                    <td>${line.Gst}</td>
                    <td>${line.Discount}</td>
                    <td>${line['Sale Price']}</td>
                    <td>${line.Amount}</td>
                </tr>`;
            }).join('')}
        </table>
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