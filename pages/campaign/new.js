import React, { Component } from 'react'
import Layout from '../../components/Layout'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

export default class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false,
    };

    submitForm = async () => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (error) {
            this.setState({errorMessage: error.message});
        }
        this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h1>New Campaign!!</h1>

                <Form onSubmit={this.submitForm} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label="We!" 
                            labelPosition="right"
                            placeholder="💰"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution: event.target.value})} />
                    </Form.Field>

                    <Message error header="Oops! 🙊" content={this.state.errorMessage} />

                    <Button disabled={this.state.loading} loading={this.state.loading} color="blue">Create!</Button>
                </Form>
            </Layout>
        )
    }
}
