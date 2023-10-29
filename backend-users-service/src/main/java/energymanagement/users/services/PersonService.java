package energymanagement.users.services;

import energymanagement.users.dtos.builders.PersonBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import energymanagement.users.controllers.handlers.exceptions.model.ResourceNotFoundException;
import energymanagement.users.dtos.PersonDTO;
import energymanagement.users.dtos.PersonDetailsDTO;
import energymanagement.users.entities.Person;
import energymanagement.users.repositories.PersonRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(PersonDetailsDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }

    @Transactional
    public UUID update(UUID personId, PersonDetailsDTO updatedPersonDTO) {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", personId);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + personId);
        }

        Person existingPerson = personOptional.get();

        existingPerson.setName(updatedPersonDTO.getName());
        existingPerson.setAge(updatedPersonDTO.getAge());
        existingPerson.setAddress(updatedPersonDTO.getAddress());
        existingPerson = personRepository.save(existingPerson);

        LOGGER.debug("Person with id {} was updated in db", existingPerson.getId());

        return existingPerson.getId();
    }

    public void delete(UUID personId) {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (personOptional.isPresent()) {
            personRepository.delete(personOptional.get());
            LOGGER.debug("Person with id {} was deleted from the database", personId);
        } else {
            LOGGER.error("Person with id {} was not found in db and could not be deleted", personId);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + personId);
        }
    }

}
