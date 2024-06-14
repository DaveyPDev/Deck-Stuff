import styled from 'styled-components';

const ErrorMessageContainer = styled.div`
  color: red;
  font-weight: bold;
  margin: 10px 0;
  // Add any other styles you want
`;

const Error = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <ErrorMessageContainer key={index}>{message}</ErrorMessageContainer>
      ))}
    </div>
  );
};

export default Error;