import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getDetailStudent, deleteStudent } from "../../service/student";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/students/$id")({
  component: StudentDetail,
});

function StudentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [student, setStudent] = useState(null);

  // Use react query to fetch API
  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ["students", id],
    queryFn: () => getDetailStudent(id),
    enabled: !!id,
  });

  const { mutate: deleting, isPending: isDeleteProcessing } = useMutation({
    mutationFn: () => deleteStudent(id),
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setStudent(data);
    }
  }, [data, isSuccess]);

  if (isPending) {
    return (
      <Row className="mt-5">
        <Col>
          <h1 className="text-center">Loading...</h1>
        </Col>
      </Row>
    );
  }

  if (isError) {
    return (
      <Row className="mt-5">
        <Col>
          <h1 className="text-center">Student is not found!</h1>
        </Col>
      </Row>
    );
  }

  const onDelete = async (event) => {
    event.preventDefault();

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this data?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            deleting();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <Row className="mt-5">
      <Col className="offset-md-3">
        <Card>
          <Card.Img variant="top" src={student?.profile_picture} />
          <Card.Body>
            <Card.Title>{student?.name}</Card.Title>
            <Card.Text>{student?.nick_name}</Card.Text>
            <Card.Text>{student?.classes?.class}</Card.Text>
            <Card.Text>{student?.universities?.name}</Card.Text>
            <div className="d-grid gap-2">
              <Card.Text>
                <div className="d-grid gap-2">
                  <Button
                    as={Link}
                    href={`/students/edit/${id}`}
                    variant="primary"
                    size="md"
                  >
                    Edit Student
                  </Button>
                </div>
              </Card.Text>
              <Card.Text>
                <div className="d-grid gap-2">
                  <Button onClick={onDelete} variant="danger" size="md">
                    Delete Student
                  </Button>
                </div>
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}></Col>
    </Row>
  );
}
