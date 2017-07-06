
import React from 'react';
const s = {};

class Footer extends React.Component {

  constructor() {
    super();
    this.state = {
      isClick: false,
    };
  }

  btnClick(evt) {
    console.log(111333222);
    this.setState({
      isClick: !this.state.isClick,
    })
  }

  componentDidMount() {
    console.log('did2222 3333333');
  }

  render() {
    return (
      <div className={s.root}>
        <h1>{!this.state.isClick ? 'click' : 'no click'}</h1>
        <div className={s.container}>
          <span className={s.text}>© Your aaaabbbbbbaaaaa</span>
          <span className={s.spacer}>·</span>
          <span className={s.spacer}>·</span>
          <span className={s.spacer}>·</span>
          <span className={s.spacer}>·</span>
          <button onClick={evt => this.btnClick(evt)}>dddddddddddddddddddddddd</button>
        </div>
      </div>
    );
  }
}

export default Footer;
