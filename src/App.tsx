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
  const [samples, setSamples] = useState(10000)

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
            <p>10th: {resultMap.get(10)?.endResult}</p>
            <p>25th: {resultMap.get(25)?.endResult}</p>
            <p>50th: {resultMap.get(50)?.endResult}</p>
            <p>75th: {resultMap.get(75)?.endResult}</p>
            <p>90th: {resultMap.get(90)?.endResult}</p>
            </>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </>);
}

export default App;
