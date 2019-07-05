import React, { Component } from "react";
import {
  Grid, Row, Col, FormGroup, FormControl, ControlLabel, Table
} from "react-bootstrap";


import Select from 'react-select';
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';

import TENKAI_API_URL from 'env.js';


class Deployment extends Component {

  state = {
    inputFilter: "",
    selectedOption: {},
    chartsResult: { charts: [] },
    environmentList: [],
    charts: [],
    repositories: [],
    selectedRepository: {},
  }

  componentDidMount() {
    this.getEnvironments();
    this.getRepos();
  }

  handleEnvironmentChange = (selectedOption) => {
    this.setState({ selectedOption });
  }

  handleRepositoryChange = (selectedRepository) => {
    this.setState({ selectedRepository });
    this.getCharts(selectedRepository.value);
  }

  getRepos() {
    axios.get(TENKAI_API_URL + '/repositories')
      .then(response => {
        var arr = [];
        for (var x = 0; x < response.data.repositories.length; x++) {
          var element = response.data.repositories[x];
          arr.push({ value: element.name, label: element.name });
        }
        this.setState({ repositories: arr });
      }).catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  getEnvironments() {
    axios.get(TENKAI_API_URL + '/environments')
      .then(response => {

        var arr = [];
        for (var x = 0; x < response.data.Envs.length; x++) {
          var element = response.data.Envs[x];
          arr.push({ value: element.ID, label: element.name });
        }
        this.setState({ environmentList: arr });


      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
    });
  }

  getCharts(repo) {
    let url = "/charts/" + repo;
    axios.get(TENKAI_API_URL + url)
      .then(response => this.setState({
        chartsResult: response.data.charts != null ? response.data : { charts: [] }
      }))
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  navigateToCheckVariables(charts, selected) {

    this.props.history.push({
      pathname: "/admin/deployment-wvars",
      search: "?environment=" + selected.value,
      state: { charts: charts, environment: selected.label }
    });

  }

  handleCheckboxChange(e) {

    const item = e.target.name;

    let array = this.state.charts;
    let index = array.indexOf(item)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ charts: array });
    } else {
      array.push(item);
      this.setState({ charts: array })
    }
  }

  onChangeInputHandler(e) {
    this.setState({
      inputFilter: e.target.value,
    })
  }

  render() {

    const { selectedOption } = this.state;
    const { selectedRepository } = this.state;

    const items = this.state.chartsResult.charts
      .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>

        <tr key={key} >
          <td><input name={item.name} checked={this.state.charts.indexOf(item.name) !== -1} type="checkbox" className="checkbox" onChange={this.handleCheckboxChange.bind(this)} /></td>
          <td>{item.name}</td>
          <td>{item.chartVersion}</td>
          <td>{item.description}</td>
        </tr>

      );

    return (
      <div className="content">
        <Grid fluid>
          <Row>

            <Col md={12}>
              <Card
                title=""
                content={
                  <div>

                    <Row>
                      <div className="col-md-5">
                        <FormGroup>
                          <ControlLabel>Environment</ControlLabel>
                          <Select value={selectedOption} onChange={this.handleEnvironmentChange} options={this.state.environmentList} />
                        </FormGroup>

                      </div>

                    </Row>

                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>

              <Card
                title="Helm Chart"
                content={
                  <div>

                    <div className="col-md-5">
                      <FormGroup>
                        <ControlLabel>Repository</ControlLabel>
                        <Select value={selectedRepository} onChange={this.handleRepositoryChange} options={this.state.repositories} />
                      </FormGroup>

                    </div>

                    <div className="col-md-8">
                      <FormGroup>
                        <ControlLabel>Chart Search</ControlLabel>
                        <FormControl
                          value={this.state.inputFilter}
                          onChange={this.onChangeInputHandler.bind(this)}
                          style={{ width: '100%' }} type="text"
                          placeholder="Search using any field"
                          aria-label="Search using any field"></FormControl>

                      </FormGroup>
                    </div>

                    <div>
                      <Table bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Helm Chart</th>
                            <th>Version</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items}
                        </tbody>
                      </Table>

                    </div>

                    <Button bsStyle="info"
                      disabled={(Object.entries(this.state.selectedOption).length === 0 &&
                        this.state.selectedOption.constructor === Object) || this.state.charts.length <= 0}
                      fill type="button"
                      onClick={this.navigateToCheckVariables.bind(this, this.state.charts, this.state.selectedOption)}>
                      Analyse Dependencies
                    </Button>

                  </div>
                }
              />
            </Col>
          </Row>

        </Grid>
      </div>
    );
  }
}

export default Deployment;
