import React from 'react';

interface FormItemProps {
  name: string;
  type: string;
  value: string | number;
}

class FormItem extends React.Component<FormItemProps> {
  constructor(props: FormItemProps) {
    super(props);
  }

  render() {
    return (
      <div className="form-item">
        <label htmlFor={this.props.name}>{this.props.name}:</label>
        <input
          className={this.props.name}
          type={this.props.type}
          name={this.props.name}
          id={this.props.name}
          defaultValue={this.props.value}
        />
      </div>
    );
  }
}

export default FormItem;