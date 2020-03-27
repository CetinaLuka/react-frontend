import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fetchTags from './api/api.js';

function ListItem(props) {
    return (
        <li className="" style={{width: 200 + 'px'}}>
            <div className="float-left">
                {props.value.naslov}
            </div>
            <div className="float-right">
                <Button onClick={() => props.buttonOnClick(props.value.id)} label='delete' />
            </div>
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
            <div class="card">
                <ul class="list-group list-group-flush">
                    {
                        this.props.tags.map(tag => (
                            <ListItem
                                value={tag}
                                buttonOnClick={(id) => this.props.buttonOnClick(id)}
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
    async componentDidMount() {
        /*await fetchTags().then((data) => this.setState({
            tags: data,
        }));*/
        await fetchTags().then((data) => console.log(data));
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
    deleteTag(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://localhost:1337/tags/'+id, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.componentDidMount();
            });
    }
    render() {
        return (
            <div>
                <TextInput value={this.state.tagInput} onValueChange={this.onValueChange.bind(this, 'tagInput')} />
                <Button onClick={() => this.addTag()} label='Add tag' />
                <List
                    tags={this.state.tags}
                    buttonOnClick={(id) => this.deleteTag(id)}
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