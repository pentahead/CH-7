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
import { useMutation, useQuery } from "@tanstack/react-query";
import Protected from "../../../components/Auth/Protected";

export const Route = createLazyFileRoute("/students/edit/$id")({
  component: () => (
    <Protected roles={[1]}>
      <EditStudent />
    </Protected>
  ),
});

function EditStudent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const [profilePicture, setProfilePicture] = useState(undefined);
  const [universityId, setUniversityId] = useState(0);
  const [classId, setClassId] = useState(0);

  const { data: universities } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversities,
    enabled: !!id,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
    enabled: !!id,
  });

  const {
    data: student,
    isSuccess,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getDetailStudent(id),
    enabled: !!id,
  });

  const { mutate: update, isPending: isUpdateProcessing } = useMutation({
    mutationFn: (request) => updateStudent(id, request),
    onSuccess: () => {
      navigate({ to: `/students/${id}` });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setName(student?.name);
      setNickName(student?.nick_name);
      setUniversityId(student?.university_id);
      setClassId(student?.class_id);
      setCurrentProfilePicture(student?.profile_picture);
    }
  }, [isSuccess, student]);

  if (isError) {
    navigate({ to: "/" });
    return;
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    const request = {
      name,
      nickName,
      classId,
      universityId,
      profilePicture,
    };
    update(request);
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
