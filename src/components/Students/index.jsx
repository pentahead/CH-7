import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "@tanstack/react-router";
import PropTypes from "prop-types";

const StudentItem = ({ student }) => {
  return (
    <Col md={3}>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={student?.profile_picture} />
        <Card.Body>
          <Card.Title>{student?.name}</Card.Title>
          <Card.Text>{student?.nick_name}</Card.Text>
          <Button as={Link} href={`/students/${student?.id}`} variant="primary">
            Detail Student
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

StudentItem.propTypes = {
  student: PropTypes.object,
};

export default StudentItem;
