import React from 'react';
import { UtilFunc } from '../../utils/UtilFunc';

interface FormItemProps {
  name: string;
  type: string;
  value: string | number;
  placeholder?: string;
}

class FormItem extends React.Component<FormItemProps> {
  constructor(props: FormItemProps) {
    super(props);
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {}

  render() {
    return (
      <div className="form-item">
        <label htmlFor={this.props.name}>{this.props.name}:</label>
        <input
          className={UtilFunc.joinSpace(this.props.name, "input-field")}
          type={this.props.type}
          name={this.props.name}
          id={this.props.name}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}

export default FormItem;
