import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function ListItem(props) {
    return (
        <li>
            {props.value.naslov}
        </li>
    );
}
class Button extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick}>
                {this.props.label}
            </button>
        );
    }
}
class TextInput extends React.Component {
    render() {
        return (
            <input type='text' value={this.props.value} onChange={this.props.onValueChange} />
        );
    }
}
class List extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    {
                        this.props.tags.map(tag => (
                            <ListItem
                                value={tag}
                            />
                        ))
                    }
                </ul>
            </div>
        );
    }
}

class Site extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            tagInput: '',
        }
    }
    componentDidMount() {
        fetch("http://localhost:1337/tags")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        tags: result
                    });
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }
    onValueChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }
    addTag() {
        const tags = this.state.tags.slice();
        const nextTag = this.state.tagInput;//'tag' + (tags.length + 1);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ naslov: this.state.tagInput, opis: 'tag narejen z react' })
        };
        fetch('http://localhost:1337/tags', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    tags: tags.concat([data]),
                })
            });
    }
    render() {
        return (
            <div>
                <TextInput value={this.state.tagInput} onValueChange={this.onValueChange.bind(this, 'tagInput')} />
                <Button onClick={() => this.addTag()} label='Add tag' />
                <List
                    tags={this.state.tags}
                />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Site />,
    document.getElementById('root')
);