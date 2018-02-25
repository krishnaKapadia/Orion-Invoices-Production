import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Line } from 'react-chartjs-2';

class LineGraph extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    var data = this.props.data;
    const currentDate = new Date();
    const past7Date = currentDate.getDate() - 7;

    var results = { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0 };

    // Filter out all orders that are created further than 1 week
    data.filter((order) => {
      var date = new Date(order.created);
      return past7Date < date;
    });

    let values = [];
    console.log(data);

    data.map((e) => {
      var date = new Date(e.created);

      // Then for each day, i.e monday 1, tuesday 2, etc..., increment a counter corresponding to that day
      switch(date.getDay()) {
        // Monday
        case 1:
          results.monday = results.monday + 1;
          break;

        case 2:
          results.tuesday = results.tuesday + 1;
          break;

        case 3:
          results.wednesday = results.wednesday + 1;
          break;

        case 4:
          results.thursday = results.thursday + 1;
          break;

        case 5:
          results.friday = results.friday + 1;
          break;
      }

      values = Object.values(results);
    });
    // Set graph data
    this.setState({ data: values });
  }

  render() {
    var line = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      datasets: [{
        label: "Jobs over last 5 days",
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.state.data
      }]
    }

    return (
      <Card>
        <CardBody>
          <div className="chart-wrapper">
            <Line data={line} />
          </div>
        </CardBody>
      </Card>
    );
  }

}

export default LineGraph;
