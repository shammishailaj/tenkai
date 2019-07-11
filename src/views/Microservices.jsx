import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup, ControlLabel, Table, Button
} from "react-bootstrap";

import Select from 'react-select';

import { Card } from "components/Card/Card.jsx";
import { ReleaseForm } from "components/Microservices/ReleaseForm.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { retriveRepo, retrieveCharts, retrieveReleases, saveReleases } from 'client-api/apicall.jsx';

class Microservices extends Component {

    state = {
        selectedChart: null,
        showInsertUpdateForm: false,
        charts: [],
        repositories: [],
        selectedRepository: {},
        releases: [],
        editMode: false,
        editItem: {}
    }

    componentDidMount() {
        retriveRepo(this);
    }

    handleRepositoryChange = (selectedRepository) => {
        this.setState({ selectedRepository });
        retrieveCharts(selectedRepository.value, this);
    }

    handleChartChange = (selectedChart) => {
        this.setState({ selectedChart }, () => {
            retrieveReleases(selectedChart.value, this);
        });
    }

    handleDependenciesClick(id) {
        this.props.history.push({
            pathname: "/admin/microservices-deps",
            search: "?releaseId=" + id,
            state: { releaseName: this.state.selectedChart.value }
        });
    }

    handleNewReleaseClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelReleaseClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }

    onSaveClick(data) {
        data.chartName = this.state.selectedChart.value;
        saveReleases(data, this);
    }

    render() {

        const { selectedChart } = this.state;
        const { selectedRepository } = this.state;

        const items = this.state.releases.map((item, key) =>
            <tr key={key} >
                <td>{item.release}</td>
                <td><a href="#/"><FontAwesomeIcon icon="minus-circle" /></a></td>
                <td><a href="#/"><FontAwesomeIcon icon="edit" onClick={this.handleDependenciesClick.bind(this, item.ID)} /></a></td>                
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
                                    <form>

                                        <FormGroup>
                                            <ControlLabel>Repository</ControlLabel>
                                            <Select value={selectedRepository} onChange={this.handleRepositoryChange} options={this.state.repositories} />
                                        </FormGroup>

                                        <FormGroup>
                                            <ControlLabel>Helm Chart</ControlLabel>
                                            <Select value={selectedChart} onChange={this.handleChartChange} options={this.state.charts} />
                                        </FormGroup>

                                        <Button className="pull-right" variant="primary" onClick={this.handleNewReleaseClick.bind(this)}>New Release</Button>

                                        <div className="clearfix" />
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <ReleaseForm 
                                editMode={this.state.editMode} 
                                editItem={this.state.editItem} 
                                saveClick={this.onSaveClick.bind(this)} 
                                cancelClick={this.handleCancelReleaseClick.bind(this)}/> : null
                            }
                        </Col>
                    </Row>

                    <Row>

                        <Col md={12}>

                            <Card
                                title="Releases"
                                category="Version number"
                                content={
                                    <div>
                                        <Table bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                    <th>Release</th>
                                                    <th>Delete</th>
                                                    <th>Dependencies</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items}
                                            </tbody>
                                        </Table>
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

export default Microservices;
