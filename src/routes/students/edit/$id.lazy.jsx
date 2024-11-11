import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { getUniversities } from "../../../service/university";
import { getClasses } from "../../../service/class";
import { getDetailStudent, updateStudent } from "../../../service/student";

export const Route = createLazyFileRoute("/students/edit/$id")({
  component: EditStudent,
});

function EditStudent() {
  const { id } = Route.useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [universities, setUniversities] = useState([]);
  const [universityId, setUniversityId] = useState(0);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(0);

  useEffect(() => {
    const getDetailStudentData = async (id) => {
      setIsLoading(true);

      const result = await getDetailStudent(id);
      if (result?.success) {
        setName(result.data.name);
        setNickName(result.data.nick_name);
        setUniversityId(result.data.university_id);
        setClassId(result.data.class_id);
        setProfilePicture(result.data.profile_picture);
        setIsNotFound(false);
      } else {
        setIsNotFound(true);
        navigate({ to: "/" });
      }
      setIsLoading(false);
    };

    const getUniversitiesData = async () => {
      const result = await getUniversities();
      if (result?.success) {
        setUniversities(result?.data);
      }
    };
    const getClassesData = async () => {
      const result = await getClasses();
      if (result?.success) {
        setClasses(result?.data);
      }
    };

    getDetailStudentData(id);
    getUniversitiesData();
    getClassesData();
  }, [id]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const request = {
      name,
      nickName,
      universityId,
      classId,
      profilePicture,
    };

    const result = await updateStudent(id, request);
    if (result?.success) {
      navigate({ to: "/students/$id" });
    }
    return result;
  };

  return (
    <Row className="mt-5">
      <Col className="offset-md-3">
        <Card>
          <Card.Header className="text-center">Edit Student</Card.Header>
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="name">
                <Form.Label column sm={3}>
                  Name
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="nick_name">
                <Form.Label column sm={3}>
                  Nick Name
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="Nick Name"
                    required
                    value={nickName}
                    onChange={(event) => {
                      setNickName(event.target.value);
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="nick_name">
                <Form.Label column sm={3}>
                  University
                </Form.Label>
                <Col sm="9">
                  <Form.Select aria-label="Default select example">
                    <option disabled>Select University</option>
                    {universities.length > 0 &&
                      universities.map((university) => (
                        <option key={university?.id} value={university?.id}>
                          {university?.name}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="nick_name">
                <Form.Label column sm={3}>
                  Class
                </Form.Label>
                <Col sm="9">
                  <Form.Select aria-label="Default select example">
                    <option disabled>Select Class</option>
                    {classes.length > 0 &&
                      classes.map((c) => (
                        <option key={c?.id} value={c?.id}>
                          {c?.class}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="profilePicture">
                <Form.Label column sm={3}>
                  Profile Picture
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="file"
                    placeholder="Choose File"
                    onChange={(event) => {
                      setProfilePicture(event.target.files[0]);
                      setCurrentProfilePicture(
                        URL.createObjectURL(event.target.files[0])
                      );
                    }}
                    accept=".jpg,.png"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="profilePicture">
                <Form.Label column sm={3}></Form.Label>
                <Col sm={9}>
                  <Image src={currentProfilePicture} fluid />
                </Col>
              </Form.Group>
              <div className="d-grid gap-2">
                <Button type="submit" variant="primary">
                  Edit Student
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}></Col>
    </Row>
  );
}
