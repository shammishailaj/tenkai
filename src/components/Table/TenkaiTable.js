import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export default class TenkaiTable extends Component {
  render() {
    let columns = [];
    this.renderColumnsFromProps(columns);

    return (
      <BootstrapTable
        bootstrap4
        striped
        hover
        condensed
        keyField={this.getKeyField()}
        data={this.props.data}
        columns={columns}
        bordered={this.bordered()}
      />
    );
  }

  getKeyField() {
    if (this.props.keyfield !== undefined) {
      return this.props.keyfield;
    }
    return 'ID';
  }

  renderColumnsFromProps(columns) {
    this.props.columns.forEach(c => columns.push(c));
  }

  bordered() {
    return this.props.bordered !== undefined ? this.props.bordered : true;
  }
}