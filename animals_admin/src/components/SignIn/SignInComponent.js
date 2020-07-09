import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Alert
} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';
import {customInput} from '../../fields';
import {
  required,
  email
} from '../../validation';


let SignInComponent = (props) => {

    const {handleSubmit, errors} = props;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      {
                        errors ?
                          <Alert color="danger">{errors}</Alert>: ''
                      }

                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Field
                          name="email"
                          component={customInput}
                          type="text"
                          placeholder="Email"
                          validate={[required,email]}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Field
                          name="password"
                          component={customInput}
                          type="password"
                          placeholder="Password"
                          validate={[required]}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">*/}
                          {/*<Button color="link" className="px-0">Forgot password?</Button>*/}
                        {/*</Col>*/}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
};

SignInComponent = reduxForm({
  form: 'login',
})(SignInComponent);

export default SignInComponent;

