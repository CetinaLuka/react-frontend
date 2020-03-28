import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/vendor/nucleo/css/nucleo.css';
import './assets/vendor/font-awesome/css/font-awesome.min.css';
import './assets/css/argon-design-system-react.css';
import { getTags, deleteTag, addTag, editTag } from './api/api.js';

function ListItem(props) {
    return (
        <li className="shadow card" >
            <div className="card-body p-3 row">
                <div className="col-8">
                    {props.value.naslov}
                </div>
                <div className="col-4">
                    <div className="">
                        <div className="float-right">
                            <SmallButton className="float-left" onClick={() => props.buttonOnClick(props.value.id)} label='delete' />
                        </div>
                        <div className="mr-1">
                            <SmallButton className="float-right" onClick={() => props.buttonOnClickEdit(props.value.id)} label='edit' />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
class Button extends React.Component {
    render() {
        return (
            <button className="btn btn-primary" onClick={this.props.onClick}>
                {this.props.label}
            </button>
        );
    }
}
class SmallButton extends React.Component {
    render() {
        return (
            <button className="btn btn-primary btn-sm" onClick={this.props.onClick}>
                {this.props.label}
            </button>
        );
    }
}
class TextInput extends React.Component {
    render() {
        return (
            <input className="form-control-alternative form-control" type='text' placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onValueChange} />
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
                                buttonOnClickEdit={(id) => this.props.buttonOnClickEdit(id)}
                            />
                        ))
                    }
                </ul>
            </div>
        );
    }
}
class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar-dark bg-primary mt-4 navbar navbar-expand-lg">
                <div className="container">
                    <a href="" className="navbar-brand">Elegit</a>
                    <button className="navbar-toggler" id="navbar-primary">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div toggler="#navbar-primary" className="collapse navbar-collapse">
                        <div className="navbar-collapse-header">
                            <div className="row">
                                <div className="collapse-brand col-6">
                                    <a href="">
                                        text
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
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
    editTag(id) {
        let allTags = this.state.tags.slice()
        let newTags = [];
        const response = editTag(id, this.state.tagInput, 'tag narejen z react preko axios')
        response.then((resp) => {
            const editedTag = resp.data;
            allTags.forEach((tag) => {
                if (tag.id === id) {
                    newTags.push(editedTag);
                }
                else {
                    newTags.push(tag);
                }
            })
            console.log(newTags);
            this.setState({
                tags: newTags,
                tagInput: '',
            })
        })
    }
    render() {
        let headerText = 'Loading tags';
        if (!this.state.loadingTags) {
            headerText = 'Available tags'
        }
        return (
            <body>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                            <h2 className="mb-2">Tags</h2>
                            <div className="row">
                                <div className="col-8">
                                    <TextInput placeholder="Tag title" value={this.state.tagInput} onValueChange={this.onValueChange.bind(this, 'tagInput')} />
                                </div>
                                <div className="col-4">
                                    <Button onClick={() => this.addTag()} label='Add tag' />
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-1">{headerText}</h3>
                            </div>
                            <div>
                                <List
                                    tags={this.state.tags}
                                    buttonOnClick={(id) => this.deleteTag(id)}
                                    buttonOnClickEdit={(id) => this.editTag(id)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        );
    }
}

// ========================================

ReactDOM.render(
    <Site />,
    document.getElementById('root')
);