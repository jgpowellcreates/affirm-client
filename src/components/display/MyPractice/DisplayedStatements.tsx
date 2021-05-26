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
    timeVar = 3000;

    runTimer = () => {
        this.interval = setInterval(() => this.incrementArray(), this.timeVar)
    }

    componentDidUpdate() {
        if (this.state.arrayNum < 3) {
        } else if (/* this.state.arrayNum >= 3 &&  */this.state.arrayNum < (this.state.testArray.length -4)) {
            clearInterval(this.interval)
            this.timeVar = this.state.defaultInterval;
            this.runTimer();
        } else if (this.state.arrayNum < this.state.testArray.length) {
            clearInterval(this.interval)
            this.timeVar = 3000;
            this.runTimer();
        } else {
            clearInterval(this.interval)
            this.props.closeModal();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    incrementArray = () => {
        this.setState({arrayNum: this.state.arrayNum + 1})
    }


    render() {
        return(
            <>
                <div className="bg-gradient-to-b from-custom-lightblue-light to-transparent w-2/3 h-60 rounded-3xl">
                    <p className="text-custom-deeppurple text-6xl font-extrabold py-14 px-2">
                        {this.state.testArray[this.state.arrayNum]}
                    </p>
                </div>
        </>
        )
    }
}