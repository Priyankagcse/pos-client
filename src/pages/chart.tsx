import React from 'react';
import { BarChart } from './chart/barchart';

export function ChartView(props: any) {
    return (<div className='col-12 p-0 row m-0'>
        {[{value: [], name: 'amount'}].map((line: any, ind: number) => {
            let datasets = [
                {
                    label: 'Amount',
                    barPercentage: 0.5,
                    barThickness: 20,
                    data: (line['value'] || []).map((row: any) => row.value),
                    borderColor: line.borderColor,
                    backgroundColor: line.backgroundColor,
                    minBarLength: 2
                }
            ];
            let monthreport = [{name: 'amount', borderColor: 'orange', backgroundColor: 'pink', value: [{amount: 100}]}]
                .filter((row: any) => row.name === line.name);
            if (monthreport.length && monthreport[0]['value'].length) {
                datasets = datasets.concat([
                    {
                        label: 'Amount',
                        barPercentage: 0.5,
                        barThickness: 20,
                        data: (monthreport[0]['value'] || []).map((row: any) => row.amount),
                        borderColor: monthreport[0].borderColor,
                        backgroundColor: monthreport[0].backgroundColor,
                        minBarLength: 2
                    }
                ]);
            }
            const data = {
                labels: (line['value'] || []).map((row: any) => row.name),
                datasets: datasets
            };
            const options = {
                scales: {
                    x: {
                        grid: {
                            offset: false,
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                // plugins: {
                //     legend: {
                //         display: false
                //     }
                // }
            };
            return <div className="col-12 col-sm-3" key={ind}>
                {props.hideHeader ? <></> : <div className='col-12 col-sm-12 py-2 fw-bold'>{line.name}</div>}
                <BarChart data={data} options={options}></BarChart>
            </div>;
        })}
    </div>);
}
