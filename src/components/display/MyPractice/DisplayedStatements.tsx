import React from 'react';
import {IAffirmations} from '../../../types/Models';

interface IStatementState {
    testArray: string[];
    arrayNum: number;
    defaultInterval: number;
}

interface IStatementProps {
    intervalArray: IAffirmations[];
    userSetInterval: number;
    closeModal: CallableFunction;
}

export default class DisplayedStatements extends React.Component <IStatementProps,IStatementState> {
    constructor(props:IStatementProps){
        super(props);
        this.state = {
            testArray: [],
            arrayNum: 0,
            defaultInterval: 7000,
        }
    }

    fillerArray : string[] = [];

    componentDidMount() {
        this.fillerArray.push("Make sure you're comfortable before we begin","Ready?", "Let's get started")
        for (let i = 0; i < this.props.intervalArray.length; i++) {
            this.fillerArray.push(this.props.intervalArray[i].statement)
        }
        this.fillerArray.push("Great job today!","Remember that this, like any exercise, takes consistent practice.","But the results are so worth the effort.","We hope to see you back tomorrow!")

        if(this.state.defaultInterval === this.props.userSetInterval) {
            this.setState({testArray: this.fillerArray, defaultInterval: this.props.userSetInterval}, () => this.runTimer())
        } else {
            this.setState({testArray: this.fillerArray}, () => this.runTimer())
        }
    }

    interval: any;
    timeVar = 2000;

    runTimer = () => {
        this.interval = setInterval(() => this.incrementArray(), this.timeVar)
    }

    componentDidUpdate() {
        if (this.state.arrayNum < 3) {
            console.log("Looping my intro text")
        } else if (/* this.state.arrayNum >= 3 &&  */this.state.arrayNum < (this.state.testArray.length -4)) {
            console.log("statement text")
            clearInterval(this.interval)
            this.timeVar = this.state.defaultInterval;
            this.runTimer();
        } else if (this.state.arrayNum < this.state.testArray.length) {
            console.log("outro text")
            clearInterval(this.interval)
            this.timeVar = 2000;
            this.runTimer();
        } else {
            console.log("Run timer is being reset right now w/ an interval of", this.timeVar)
            clearInterval(this.interval)
            this.props.closeModal();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    incrementArray = () => {
        this.setState({arrayNum: this.state.arrayNum + 1})
        console.log("Increment Array is running. ArrayNum is currently at:", this.state.arrayNum, "and Time Variable is at:", this.timeVar)
    }


    render() {
        return(
            <>
                <p>{this.state.testArray[this.state.arrayNum]}</p>
            </>
        )
    }
}