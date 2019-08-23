import { Alert, Badge, Calendar } from 'antd';
import 'antd/dist/antd.css';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { Component } from 'react';
import styled from 'styled-components';

moment.locale('zh-cn')

const DavidArr = ['休息', '休息', '夜班', '夜班', '中班', '中班', '白班', '白班']
const HongArr = ['上班', '休息']

function getListData (value: any) {
  const DavidDays = moment('2019-5-4').diff(value.format('YYYY-MM-DD'), 'days')
  const HongDays = moment('2019-5-4').diff(value.format('YYYY-MM-DD'), 'days')
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
  return listData || [];
}

function dateCellRender (value: any) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {
        listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))
      }
    </ul>
  );
}

function getMonthData (value: any) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender (value: any) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
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
    selectedValue: moment(),
  }

  onSelect = (value: any) => {
    this.setState({
      value,
      selectedValue: value,
    });
  }

  onPanelChange = (value: any) => {
    this.setState({ value });
  }

  get David () {
    const { selectedValue } = this.state
    const obj = selectedValue && getListData(selectedValue).find(item => item.type === 'success')
    return obj && obj.content
  }

  get Hong () {
    const { selectedValue } = this.state
    const obj = selectedValue && getListData(selectedValue).find(item => item.type === 'warning')
    return obj && obj.content
  }

  render () {
    const { value, selectedValue } = this.state

    return (
      <div className="workingSchedule">
        <h1 style={{ marginTop: '.5em' }}>{selectedValue && selectedValue.format('YYYY-MM-DD')}</h1>
        <Alert type='success' message={`${this.David}`} />
        <Alert type='warning' message={`${this.Hong}`} />

        <CalendarStyled
          value={value}
          onSelect={this.onSelect}
          onPanelChange={this.onPanelChange}
          locale={locale}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </div>
    );

  }
}

export default WorkingSchedule;
