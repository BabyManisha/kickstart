import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import { Form, Button, Message, Input } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'
import { Link, Router } from '../../../routes'

export default class RequestNew extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    }

    static async getInitialProps(props){
        const { address } = props.query;
        return { address };
    }

    submitForm = async () => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        const {description, value, recipient} = this.state;
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({from: accounts[0]});
            Router.pushRoute(`/campaign/${this.props.address}/requests`)
        } catch (error) {
            this.setState({loading: false, errorMessage: error.message});
        }
    }
 
    render() {
        return (
            <Layout>
                <Link route={`/campaign/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h1>Create a New Request!</h1>
                <Form onSubmit={this.submitForm} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description}
                            onChange={event => this.setState({description: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input label="Ether!" 
                            labelPosition="right"
                            placeholder="💰"
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value})}/>
                    </Form.Field>

                    <Message error header="Oops! 🙊" content={this.state.errorMessage} />

                    <Button disabled={this.state.loading} loading={this.state.loading} color="blue">Create Request</Button>
                </Form>
            </Layout>
        )
    }
}
