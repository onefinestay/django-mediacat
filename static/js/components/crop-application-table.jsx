var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Icon = require('./common/icon');
var List = require('./common/list');
var FluxMixin = require('./mixins/flux-mixin');


var CropApplicationRow = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var application = this.props.application;

    return (
      <tr className="mediacat-applications-table__row">
        <td>{application.get('object_label')}</td>
        <td>{application.get('content_type_label')}</td>
        <td>{application.get('field_label')}</td>
        <td>{application.get('can_delete') ? <Icon size="large" glyph="hairline-delete" /> : null}</td>
      </tr>
    );
  }
});


var CropApplicationTable = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var applications = this.props.crop.get('applications');

    if (applications.count() === 0) {
      return null;
    }

    var items = applications.map(a => <CropApplicationRow key={a.get('id')} crop={this.props.crop} application={a} />);

    return (
      <div className="mediacat-applications-table">
        <table className="mediacat-table mediacat-table--grid">
          <thead>
            <tr>
              <th>Label</th>
              <th>Type</th>
              <th>Field</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {items.toJS()}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = CropApplicationTable;