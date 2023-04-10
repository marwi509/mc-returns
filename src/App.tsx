import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Card, Col, Form, Stack } from 'react-bootstrap';
import Row from 'react-bootstrap/esm/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Result, simulateReturn } from './mc';
import ReactECharts from 'echarts-for-react';  // or var ReactECharts = require('echarts-for-react');


//import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [years, setYears] = useState(10)
  const [startValue, setStartValue] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(5000)
  const [yearReturn, setYearReturn] = useState(8.5)
  const [stdDev, setStdDev] = useState(17.4)
  const [samples, setSamples] = useState(100000)

  const [resultMap, setResultMap] = useState<Map<number, Result> |undefined>(undefined)

  const calculate = async () => {
    const m = await simulateReturn(years, yearReturn, startValue, stdDev, monthlySavings, samples)
    setResultMap(m)

  }

  let xAxist: number[] = []
  for (let i = 0; i < years * 14; i ++) {
    xAxist.push(i)
  }
  const option = resultMap != null ? {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['25th', '50th', '75th']
    },
    xAxis: {
      type: 'category',
      data: xAxist
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: resultMap?.get(25)?.series,
        type: 'line'
      },
      {
        data: resultMap?.get(50)?.series,
        type: 'line'
      },
      {
        data: resultMap?.get(75)?.series,
        type: 'line'
      },
    ]
  } : {};

  /*const formatNumber = (num: number): string => {
    Intl.NumberFormat.
  }*/
  const formatNumber = (num: number): string => new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(num);

  const a = 1

  const section = (result: Result, percentile: string) => <>
  <Stack direction={'vertical'} gap={1}>
    <h5>{percentile}:</h5>
    <span>End result: {formatNumber(result.endResult)}</span>
    <span>Total return: {formatNumber(result.totalReturn)}</span>
    <span>Total saved: {formatNumber(result.saved)}</span>
    <span>CAGR: {0.01 * Math.round((result.cagr - 1) * 10000)}%</span>
    </Stack>
  </>

  return (<>
  <Row>
    <Col lg={4}>
    <Card>
      <Card.Header>Input</Card.Header>
      <Card.Body>
        <Stack direction={'vertical'} gap={2}>
        <Form.Label>
          Antal år
        <Form.Control
          type='number'
          value={years}
          onChange={e => setYears(parseInt(e.target.value))}
          id='years'
        />
        </Form.Label>
        
        <Form.Label>
          Startvärde
        <Form.Control
          type='number'
          value={startValue}
          onChange={e => setStartValue(parseInt(e.target.value))}
          id='start'
        />
        </Form.Label>
        <Form.Label>
          Månadsspar
        <Form.Control
          type='number'
          value={monthlySavings}
          onChange={e => setMonthlySavings(parseInt(e.target.value))}
          id='monthly'
        />
        </Form.Label>
        <Form.Label>
          Aritmetiskt genomsnitt avkastning per år
        <Form.Control
          type='number'
          value={yearReturn}
          onChange={e => setYearReturn(parseInt(e.target.value))}
          id='return'
        />
        </Form.Label>
        <Form.Label>
          Standardavvikelse årsbasis
        <Form.Control
          type='number'
          value={stdDev}
          onChange={e => setStdDev(parseInt(e.target.value))}
          id='stddev'
        />
        </Form.Label>
        <Form.Label>
          Samples
        <Form.Control
          type='number'
          value={samples}
          onChange={e => setSamples(parseInt(e.target.value))}
          id='samples'
        />
        </Form.Label>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button onClick={calculate} variant={'outline-success'}>Simulate</Button>
      </Card.Footer>
    </Card>
    </Col>

    <Col lg={8}>
      {resultMap != null && 
    <ReactECharts
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}/>
}
    </Col>
    </Row>
    <Row>
      <Col lg={4}>
        <Card>
          <Card.Header>Results</Card.Header>
          <Card.Body>
            {resultMap != null && 
            <>
            {section( resultMap.get(10)!, '10th')}
            {section( resultMap.get(25)!, '25th')}
            {section( resultMap.get(50)!, '50th')}
            {section( resultMap.get(75)!, '75th')}
            {section( resultMap.get(90)!, '90th')}
            </>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </>);
}

export default App;
