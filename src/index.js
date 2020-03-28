import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/vendor/nucleo/css/nucleo.css';
import './assets/vendor/font-awesome/css/font-awesome.min.css';
import './assets/css/argon-design-system-react.css';
import { getTags, deleteTag, addTag, editTag, getEntitys } from './api/api.js';

function Tag(props) {
    return (
        <li className="custom-shadow card mb-2 border-0" >
            <div className="card-body p-3 row">
                <div className="col-8">
                    <h4>
                        {props.value.naslov}
                    </h4>
                    <p className="mb-0">
                        {props.value.opis}
                    </p>
                </div>
                <div className="col-4">
                    <div className="row">
                        <div className="col-6">
                            <Button type='danger' size='small' onClick={() => props.buttonOnClick(props.value.id)} label='delete' />
                        </div>
                        <div className="col-6">
                            <Button size='small' onClick={() => props.buttonOnClickEdit(props.value.id)} label='edit' />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
function Entity(props) {
    return (
        <li className="custom-shadow card mb-2 border-0" >
            <div className="card-body p-3">
                <div className='row'>
                    <div className='col-8'>
                        <h4>
                            {props.value.naziv}
                        </h4>
                    </div>
                    <div className='col-4'>
                        <div className='float-right'>
                            <span class="text-uppercase badge badge-primary badge-pill">{props.value.tip}</span>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col">
                        <p className="pb-0">
                            {props.value.opis}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}
class Button extends React.Component {
    render() {
        let size = '';
        if (this.props.size === 'small')
            size = 'btn-sm';
        else if (this.props.size === 'large')
            size = 'btn-lg';

        let type = 'btn-primary';
        if (this.props.type === 'danger')
            type = 'btn-danger';
        return (
            <button className={'btn ' + type + ' ' + size} onClick={this.props.onClick}>
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
class TagList extends React.Component {
    render() {
        return (
            <div className="">
                <ul className="list-group list-group-flush">
                    {
                        this.props.tags.map(tag => (
                            <Tag
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
class EntityList extends React.Component {
    render() {
        return (
            <div className="">
                <ul className="list-group list-group-flush">
                    {
                        this.props.entitys.map(entity => (
                            <Entity
                                key={entity.id}
                                value={entity}
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
            entitys: [],
            tagTitle: '',
            tagDescription: '',
            loadingTags: true,
        }
    }
    componentDidMount() {
        const tagResponse = getTags()
        tagResponse.then((resp) => {
            const tags = resp.data;
            console.log(tags);
            this.setState({
                tags: tags,
                loadingTags: false,
            });
        });
        const entityResponse = getEntitys()
        entityResponse.then((resp) => {
            const entitys = resp.data;
            console.log(entitys);
            this.setState({
                entitys: entitys,
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
        const response = addTag(this.state.tagTitle, this.state.tagDescription)
        response.then((resp) => {
            const newTag = resp.data;
            this.setState({
                tags: allTags.concat([newTag]),
                tagTitle: '',
                tagDescription: '',
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
        const response = editTag(id, this.state.tagTitle, this.state.tagDescription)
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
                tagTitle: '',
                tagDescription: '',
            })
        })
    }
    render() {
        let headerText = 'Loading tags';
        if (!this.state.loadingTags) {
            headerText = 'Available tags'
        }
        return (
            <div className="container pt-4">
                <div className="row">
                    <div className="col-sm-12 col-md-8 col-lg-6">
                        <h2 className="mb-2">Tags</h2>
                        <div className="row">
                            <div className="col-8">
                                <TextInput placeholder="Tag title" value={this.state.tagTitle} onValueChange={this.onValueChange.bind(this, 'tagTitle')} />
                                <div className="mt-2">
                                    <TextInput placeholder="Tag description" value={this.state.tagDescription} onValueChange={this.onValueChange.bind(this, 'tagDescription')} />
                                </div>
                            </div>
                            <div className="col-4">
                                <Button onClick={() => this.addTag()} label='Add tag' />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-1">{headerText}</h3>
                        </div>
                        <div>
                            <TagList
                                tags={this.state.tags}
                                buttonOnClick={(id) => this.deleteTag(id)}
                                buttonOnClickEdit={(id) => this.editTag(id)}
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-6">
                        <EntityList
                            entitys={this.state.entitys}/>
                    </div>
                </div>
            </div>

        );
    }
}

// ========================================

ReactDOM.render(
    <Site />,
    document.getElementById('root')
);