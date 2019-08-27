import { Alert, Badge, Calendar } from 'antd';
import 'antd/dist/antd.css';
// import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { Component } from 'react';
import styled from 'styled-components';

const formatStr = 'YYYY-M-DD'

moment.locale('zh-cn')

const DavidArr = ['休息', '休息', '夜班', '夜班', '中班', '中班', '白班', '白班']
const HongArr = ['上班', '休息']
const JunArr = ['白一', '白二', '白三', '夜班']

function getListData (value: any) {
  const DavidDays = moment('2019-5-4', formatStr).diff(value.format('YYYY-MM-DD'), 'days')
  const HongDays = moment('2019-5-4', formatStr).diff(value.format('YYYY-MM-DD'), 'days')
  const JunDays = moment('2019-8-26', formatStr).diff(value.format('YYYY-MM-DD'), 'days')
  let listData: ({ type: 'warning' | 'success' | 'error', content: string })[] = []

  if (DavidDays <= 0) {
    const DavidIndex = Math.abs(DavidDays) % 8
    listData.push({
      type: 'success',
      content: '郭  ' + DavidArr[DavidIndex]
    })
  }

  if (HongDays <= 0) {
    const HongIndex = Math.abs(HongDays) % 2
    listData.push({
      type: 'warning',
      content: '岳  ' + HongArr[HongIndex]
    })
  }

  if (JunDays <= 0) {
    const JunIndex = Math.abs(JunDays) % 4
    const isWeekend = (value.format('E') === '6' || value.format('E') === '7')
    const text = isWeekend ? '休' : JunArr[JunIndex]

    listData.push({
      type: 'error',
      content: '军  ' + text
    })
  }
  return listData || [];
}

function dateCellRender (value: any) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {
        listData.map((item, index) => (
          <li key={item.content + index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))
      }
    </ul>
  );
}

const CalendarStyled = styled(Calendar)`
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
`

class WorkingSchedule extends Component {
  state = {
    value: moment(),
  }

  onSelect = (value: any) => {
    this.setState({
      value,
    });
  }

  onPanelChange = (value: any) => {
    this.setState({ value })
  }

  get David () {
    const { value } = this.state
    const obj = value && getListData(value).find(item => item.type === 'success')
    return obj && obj.content
  }

  get Hong () {
    const { value } = this.state
    const obj = value && getListData(value).find(item => item.type === 'warning')
    return obj && obj.content
  }

  get Jun () {
    const { value } = this.state
    const obj: any = value && getListData(value).find(item => item.type === 'error')
    const xx = getListData(value)
    return obj && obj.content
  }

  render () {
    const { value } = this.state
    return (
      <div className="workingSchedule">
        <h1 style={{ marginTop: '.5em' }}>{value && value.format('YYYY-MM-DD')}</h1>
        <Alert type='success' message={`${this.David}`} />
        <Alert type='warning' message={`${this.Hong}`} />
        <Alert type='error' message={`${this.Jun}`} />
        <CalendarStyled
          value={value}
          onSelect={this.onSelect}
          onPanelChange={this.onPanelChange}
          dateCellRender={dateCellRender}
        />
      </div>
    );

  }
}

export default WorkingSchedule;
