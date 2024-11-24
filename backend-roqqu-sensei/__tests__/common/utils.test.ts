import {createErrorResponse, createSuccessResponse} from "../../src/common";

describe('createSuccessResponse', () => {
  it('Should return a valid success response', () => {
    const success = createSuccessResponse({name: 'Pete'}, 'created successfully');
    expect(success).toBeDefined();
    expect(success.message).toEqual('created successfully');
    expect(success.status).toEqual('success');
    expect(success.data).toEqual({name: 'Pete'});
  });
});

describe('createErrorResponse', () => {
  it('Should return a valid error response', () => {
    const success = createErrorResponse('failed with an error', {name: 'Pete'});
    expect(success).toBeDefined();
    expect(success.message).toEqual('failed with an error');
    expect(success.status).toEqual('error');
    expect(success.data).toEqual({name: 'Pete'});
  });
})
