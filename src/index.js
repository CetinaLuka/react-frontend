import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTags, deleteTag, addTag} from './api/api.js';

function ListItem(props) {
    return (
        <li className="" style={{ width: 200 + 'px' }}>
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
            <div className="card">
                <ul className="list-group list-group-flush">
                    {
                        this.props.tags.map(tag => (
                            <ListItem
                                key={tag.id}
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
            loadingTags: true,
        }
    }
    componentDidMount() {
        const response = getTags()
        response.then((resp) => {
            const tags = resp.data;
            console.log(tags);
            this.setState({
                tags: tags,
                loadingTags: false,
            });
        });
    }
    onValueChange(key, event) {
        this.setState({
            [key]: event.target.value
        })
    }
    addTag() {
        const allTags = this.state.tags.slice()
        const response = addTag(this.state.tagInput, 'tag narejen z react preko axios')
        response.then((resp) => {
            const newTag = resp.data;
            this.setState({
                tags: allTags.concat([newTag]),
                tagInput: '',
            })
        })
    }
    deleteTag(id) {
        const response = deleteTag(id)
        response.then((resp) => {
            console.log(resp);
            const allTags = this.state.tags.slice();
            const newTags = allTags.filter(tag => tag.id !== id);
            this.setState({
                tags: newTags,
            })
        });
    }
    render() {
        let headerText = 'Loading tags';
        if (!this.state.loadingTags) {
            headerText = 'Available tags'
        }
        return (
            <div>
                <TextInput value={this.state.tagInput} onValueChange={this.onValueChange.bind(this, 'tagInput')} />
                <Button onClick={() => this.addTag()} label='Add tag' />
                <h3>{headerText}</h3>
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