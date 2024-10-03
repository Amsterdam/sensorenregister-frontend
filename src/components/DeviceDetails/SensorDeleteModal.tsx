import React, { useState } from 'react';
import { Close } from '@amsterdam/asc-assets';
import { Modal as DefaultModal, Button, Heading, Paragraph } from '@amsterdam/asc-ui';
import styled from 'styled-components';
import { getSpacing } from '../../utils/spacing';
import CONFIGURATION from '../../shared/environment';

interface SensorDeleteModalProps {
  open: boolean;
  onClose: () => void;
  sensorId: string;
  email: string;
}

const SensorDeleteModal: React.FC<SensorDeleteModalProps> = ({ open, onClose, sensorId, email }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // TODO: Send delete request to the backend with sensorID
      // const response = await fetch(`${CONFIGURATION.API_ROOT}deleteDevice/`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ sensorId }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to delete the sensor.'); // Handle error response
      // }

      console.log('Sensor deleted successfully');
      setSuccessMessage('Uw aanvraag is verstuurd.');
    } catch (error) {
      console.error('Er ging iets mis:', error);
    } finally {
      setTimeout(() => {
        setSuccessMessage(null); // Clear message after a delay
        onClose();
        setIsDeleting(false);
      }, 3000);
    }
  };

  if (!open) return null;

  return (
    <StyledModal open={open} onClose={onClose} zIndexOffset={500}>
      <ModalHeader>
        <ModalTitle>Bevestig verzoek om sensor te verwijderen</ModalTitle>
        <CloseButton
          variant="blank"
          icon={<Close />}
          iconSize={16}
          onClick={onClose}
        />
      </ModalHeader>

      <HorizontalRule />

      <ModalContent>
        <ParagraphStyled>
          Weet je zeker dat je deze sensor wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
          We sturen een email naar de eigenaar om de sensor te verwijderen op {email}.
        </ParagraphStyled>
      </ModalContent>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <ModalFooter>
        <Button variant="secondary" onClick={handleDeleteConfirm} disabled={isDeleting}>
          Bevestig
        </Button>
        <Button color="bright" onClick={onClose}>
          Annuleer
        </Button>
      </ModalFooter>
    </StyledModal>
  );
};

const SuccessMessage = styled(Paragraph)`
  color: green;
  margin-top: 1em;
  padding: 0 1.5em;
`;

const StyledModal = styled(DefaultModal)`
  min-width: 400px; // Adjust as needed
`;

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1.5em;
`;

const ModalHeader = styled(ModalContent)`
  justify-content: space-between;
  padding: .5em .5em 0 1.5em;
`;

const ModalFooter = styled(ModalContent)`
  gap: ${getSpacing("md")};
  padding-block: 0.5em 1.5em;
`;

export const ModalTitle = styled(Heading)`
  font-size: 1.1rem;
  margin: 0;
  line-height: 1rem;
`;

const CloseButton = styled(Button)`
  background-color: transparent;
  color: currentColor;

  & > span {
    transition: transform 250ms ease-out;

    svg path {
      transition: stroke 250ms ease-out;
    }
  }

  & > span svg path {
    fill: currentColor;
  }

  &:hover,
  &:focus {
    outline: none;
    background-color: transparent;

    & > span {
      transform: scale(1.125);

      svg path {
        stroke: white;
        stroke-width: 1px;
      }
    }
  }
`;

const HorizontalRule = styled.hr`
  border: .5px solid;
`;

const ParagraphStyled = styled(Paragraph)`
  margin-block: 0.05em;
`;

export default SensorDeleteModal;
